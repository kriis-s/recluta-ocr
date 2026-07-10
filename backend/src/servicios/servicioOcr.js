const fs = require('fs');
const path = require('path');
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;

function obtenerMimeType(rutaArchivo) {
  const extension = path.extname(rutaArchivo).toLowerCase();

  if (extension === '.pdf') {
    return 'application/pdf';
  }

  if (extension === '.jpg' || extension === '.jpeg') {
    return 'image/jpeg';
  }

  if (extension === '.png') {
    return 'image/png';
  }

  return 'application/pdf';
}

function normalizarTexto(texto) {
  if (!texto) {
    return '';
  }

  return texto
    .toString()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\./g, '')
    .replace(/[^A-Z0-9KÑ\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function limpiarRut(rut) {
  if (!rut) {
    return null;
  }

  const rutLimpio = rut
    .replace(/\./g, '')
    .replace(/\s/g, '')
    .toUpperCase();

  if (!rutLimpio.includes('-') && rutLimpio.length >= 8) {
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);
    return `${cuerpo}-${dv}`;
  }

  return rutLimpio;
}

function extraerRut(texto) {
  const coincidencia = texto.match(/\b\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK]\b/);

  if (!coincidencia) {
    return null;
  }

  return limpiarRut(coincidencia[0]);
}

function convertirFechaAFormatoMysql(fechaTexto) {
  if (!fechaTexto) {
    return null;
  }

  const partes = fechaTexto.match(/\d+/g);

  if (!partes || partes.length !== 3) {
    return null;
  }

  let dia;
  let mes;
  let anio;

  if (partes[0].length === 4) {
    anio = Number(partes[0]);
    mes = Number(partes[1]);
    dia = Number(partes[2]);
  } else {
    dia = Number(partes[0]);
    mes = Number(partes[1]);
    anio = Number(partes[2]);
  }

  if (anio < 100) {
    anio += 2000;
  }

  if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || anio < 1900) {
    return null;
  }

  const fecha = new Date(anio, mes - 1, dia);

  if (
    fecha.getFullYear() !== anio ||
    fecha.getMonth() !== mes - 1 ||
    fecha.getDate() !== dia
  ) {
    return null;
  }

  const diaTexto = String(dia).padStart(2, '0');
  const mesTexto = String(mes).padStart(2, '0');

  return `${anio}-${mesTexto}-${diaTexto}`;
}

function extraerFechaEmision(texto) {
  const coincidencias = texto.match(/\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2})\b/g);

  if (!coincidencias) {
    return null;
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechasValidas = coincidencias
    .map(convertirFechaAFormatoMysql)
    .filter(Boolean)
    .map(function convertir(fechaMysql) {
      return {
        fecha_mysql: fechaMysql,
        fecha: new Date(`${fechaMysql}T00:00:00`)
      };
    })
    .filter(function filtrarFecha(item) {
      return item.fecha <= hoy && item.fecha.getFullYear() >= 2010;
    })
    .sort(function ordenarPorCercania(a, b) {
      return b.fecha - a.fecha;
    });

  if (fechasValidas.length === 0) {
    return null;
  }

  return fechasValidas[0].fecha_mysql;
}

function extraerInstitucionSalud(texto) {
  const textoNormalizado = normalizarTexto(texto);

  if (textoNormalizado.includes('FONASA')) {
    return {
      institucion_detectada: 'FONASA',
      tipo_institucion: 'SALUD'
    };
  }

  const isapres = [
    'BANMEDICA',
    'COLMENA',
    'CONSALUD',
    'CRUZ BLANCA',
    'CRUZ DEL NORTE',
    'NUEVA MASVIDA',
    'MASVIDA',
    'VIDA TRES',
    'ESENCIAL'
  ];

  const isapreDetectada = isapres.find(function buscarIsapre(isapre) {
    return textoNormalizado.includes(isapre);
  });

  if (isapreDetectada) {
    return {
      institucion_detectada: `ISAPRE ${isapreDetectada}`,
      tipo_institucion: 'SALUD'
    };
  }

  return {
    institucion_detectada: null,
    tipo_institucion: null
  };
}

function extraerAfp(texto) {
  const textoNormalizado = normalizarTexto(texto);

  const afps = [
    'CAPITAL',
    'CUPRUM',
    'HABITAT',
    'MODELO',
    'PLANVITAL',
    'PROVIDA',
    'UNO'
  ];

  const afpDetectada = afps.find(function buscarAfp(afp) {
    return textoNormalizado.includes(afp) || textoNormalizado.includes(`AFP ${afp}`);
  });

  if (!afpDetectada) {
    return {
      institucion_detectada: null,
      tipo_institucion: null
    };
  }

  return {
    institucion_detectada: `AFP ${afpDetectada}`,
    tipo_institucion: 'AFP'
  };
}

function obtenerNombreRegistrado(datosPostulante) {
  if (!datosPostulante) {
    return '';
  }

  return [
    datosPostulante.nombres,
    datosPostulante.apellido_paterno,
    datosPostulante.apellido_materno
  ]
    .filter(Boolean)
    .join(' ');
}

function compararNombreConTexto(nombreRegistrado, textoExtraido) {
  const nombreNormalizado = normalizarTexto(nombreRegistrado);
  const textoNormalizado = normalizarTexto(textoExtraido);

  const palabrasNombre = nombreNormalizado
    .split(' ')
    .filter(function filtrarPalabra(palabra) {
      return palabra.length >= 3;
    });

  if (palabrasNombre.length === 0 || !textoNormalizado) {
    return {
      coincide_nombre: false,
      palabras_nombre_encontradas: []
    };
  }

  const palabrasEncontradas = palabrasNombre.filter(function buscarPalabra(palabra) {
    return textoNormalizado.includes(palabra);
  });

  const minimoCoincidencias = palabrasNombre.length >= 3 ? 2 : 1;

  return {
    coincide_nombre: palabrasEncontradas.length >= minimoCoincidencias,
    palabras_nombre_encontradas: palabrasEncontradas
  };
}

function obtenerPrimeraLineaNombreCurriculum(texto) {
  const lineas = texto
    .split('\n')
    .map(function limpiarLinea(linea) {
      return linea.trim();
    })
    .filter(Boolean);

  const lineasDescartadas = [
    'nota',
    'documento de ejemplo',
    'fines de prueba',
    'ocr',
    'perfil profesional',
    'experiencia laboral',
    'educacion',
    'habilidades',
    'competencias',
    'contacto',
    'telefono',
    'correo',
    'email',
    'santiago',
    'region'
  ];

  const lineaNombre = lineas.find(function buscarLineaValida(linea) {
    const lineaNormalizada = normalizarTexto(linea);

    const contieneTextoDescartado = lineasDescartadas.some(function buscarTexto(textoDescartado) {
      return lineaNormalizada.includes(normalizarTexto(textoDescartado));
    });

    const tieneNumeros = /\d/.test(linea);
    const esMuyLarga = linea.length > 80;
    const tieneCorreo = linea.includes('@');
    const tieneTelefono = linea.includes('+56');

    return (
      !contieneTextoDescartado &&
      !tieneNumeros &&
      !esMuyLarga &&
      !tieneCorreo &&
      !tieneTelefono &&
      lineaNormalizada.split(' ').length >= 3
    );
  });

  if (!lineaNombre) {
    return null;
  }

  return normalizarTexto(lineaNombre);
}

function extraerNombreBasico(texto, datosPostulante, tipoDocumento = null) {
  const nombreRegistrado = obtenerNombreRegistrado(datosPostulante);

  if (nombreRegistrado) {
    const comparacion = compararNombreConTexto(nombreRegistrado, texto);

    if (comparacion.coincide_nombre) {
      return normalizarTexto(nombreRegistrado);
    }
  }

  if (tipoDocumento === 'CURRICULUM') {
    const nombreCurriculum = obtenerPrimeraLineaNombreCurriculum(texto);

    if (nombreCurriculum) {
      return nombreCurriculum;
    }
  }

  const lineas = texto
    .split('\n')
    .map(function limpiarLinea(linea) {
      return linea.trim();
    })
    .filter(Boolean);

  const lineaNombre = lineas.find(function buscarLinea(linea) {
    const lineaMinuscula = linea.toLowerCase();

    const esLineaDescartada =
      lineaMinuscula.includes('nota') ||
      lineaMinuscula.includes('documento de ejemplo') ||
      lineaMinuscula.includes('fines de prueba');

    if (esLineaDescartada) {
      return false;
    }

    return (
      lineaMinuscula.includes('nombre') ||
      lineaMinuscula.includes('nombres') ||
      lineaMinuscula.includes('apellido')
    );
  });

  if (!lineaNombre) {
    return null;
  }

  return normalizarTexto(
    lineaNombre
      .replace(/nombre/gi, '')
      .replace(/nombres/gi, '')
      .replace(/apellido/gi, '')
      .replace(/apellidos/gi, '')
      .replace(/:/g, '')
      .trim()
  ) || null;
}

function validarContraPostulante(resultado, datosPostulante, textoExtraido) {
  if (!datosPostulante) {
    return {
      coincide_rut: false,
      coincide_nombre: false,
      observacion_validacion: 'No se recibieron datos del postulante para validar.'
    };
  }

  const rutRegistrado = limpiarRut(datosPostulante.rut);
  const rutDetectado = limpiarRut(resultado.rut_detectado);

  const coincideRut = Boolean(rutRegistrado && rutDetectado && rutRegistrado === rutDetectado);

  const nombreRegistrado = obtenerNombreRegistrado(datosPostulante);
  const comparacionNombre = compararNombreConTexto(nombreRegistrado, textoExtraido);

  let observacion = 'Documento analizado con OCR.';

  if (coincideRut && comparacionNombre.coincide_nombre) {
    observacion = 'RUT y nombre coinciden con los datos registrados por el postulante.';
  } else if (coincideRut && !comparacionNombre.coincide_nombre) {
    observacion = 'El RUT coincide, pero no se logró confirmar completamente el nombre.';
  } else if (!coincideRut && comparacionNombre.coincide_nombre) {
    observacion = 'El nombre coincide, pero el RUT no coincide o no fue detectado.';
  } else {
    observacion = 'No se logró confirmar coincidencia de RUT y nombre con los datos registrados.';
  }

  return {
    coincide_rut: coincideRut,
    coincide_nombre: comparacionNombre.coincide_nombre,
    observacion_validacion: observacion
  };
}

function detectarInstitucionPorTipo(textoExtraido, tipoDocumento) {
  if (tipoDocumento === 'CERTIFICADO_SALUD') {
    return extraerInstitucionSalud(textoExtraido);
  }

  if (tipoDocumento === 'CERTIFICADO_PREVISIONAL') {
    return extraerAfp(textoExtraido);
  }

  if (tipoDocumento === 'CEDULA') {
    return {
      institucion_detectada: 'REGISTRO CIVIL',
      tipo_institucion: 'IDENTIDAD'
    };
  }

  if (tipoDocumento === 'CURRICULUM') {
    return {
      institucion_detectada: null,
      tipo_institucion: 'CURRICULUM'
    };
  }

  return {
    institucion_detectada: null,
    tipo_institucion: null
  };
}

async function procesarDocumentoConOcr(rutaArchivo, datosPostulante = null, tipoDocumento = null) {
  const projectId = process.env.DOCUMENT_AI_PROJECT_ID;
  const location = process.env.DOCUMENT_AI_LOCATION;
  const processorId = process.env.DOCUMENT_AI_PROCESSOR_ID;

  if (!projectId || !location || !processorId) {
    throw new Error('Faltan variables de entorno de Document AI.');
  }

  const cliente = new DocumentProcessorServiceClient({
    apiEndpoint: `${location}-documentai.googleapis.com`
  });

  const nombreProcesador = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  const contenidoArchivo = fs.readFileSync(rutaArchivo);
  const archivoBase64 = contenidoArchivo.toString('base64');
  const mimeType = obtenerMimeType(rutaArchivo);

  const solicitud = {
    name: nombreProcesador,
    rawDocument: {
      content: archivoBase64,
      mimeType
    }
  };

  const [resultado] = await cliente.processDocument(solicitud);

  const documento = resultado.document;
  const textoExtraido = documento.text || '';

  const institucion = detectarInstitucionPorTipo(textoExtraido, tipoDocumento);

  const datosExtraidos = {
    texto_extraido: textoExtraido,
    rut_detectado: extraerRut(textoExtraido),
    nombre_detectado: extraerNombreBasico(textoExtraido, datosPostulante, tipoDocumento),
    fecha_nacimiento_detectada: null,
    fecha_emision_detectada: extraerFechaEmision(textoExtraido),
    institucion_detectada: institucion.institucion_detectada,
    tipo_institucion: institucion.tipo_institucion,
    confianza: documento.pages?.[0]?.confidence || null
  };

  const validacion = validarContraPostulante(
    datosExtraidos,
    datosPostulante,
    textoExtraido
  );

  return {
    ...datosExtraidos,
    coincide_rut: validacion.coincide_rut,
    coincide_nombre: validacion.coincide_nombre,
    observacion_validacion: validacion.observacion_validacion
  };
}

module.exports = {
  procesarDocumentoConOcr
};