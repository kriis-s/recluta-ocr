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

function limpiarRut(rut) {
  if (!rut) {
    return null;
  }

  return rut
    .replace(/\./g, '')
    .replace(/\s/g, '')
    .toUpperCase();
}

function extraerRut(texto) {
  const coincidencia = texto.match(/\b\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK]\b/);

  if (!coincidencia) {
    return null;
  }

  return limpiarRut(coincidencia[0]);
}

function extraerFecha(texto) {
  const coincidencia = texto.match(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/);

  if (!coincidencia) {
    return null;
  }

  return coincidencia[0];
}

function extraerNombreBasico(texto) {
  const lineas = texto
    .split('\n')
    .map(function limpiarLinea(linea) {
      return linea.trim();
    })
    .filter(Boolean);

  const lineaNombre = lineas.find(function buscarLinea(linea) {
    const lineaMinuscula = linea.toLowerCase();

    return (
      lineaMinuscula.includes('nombre') ||
      lineaMinuscula.includes('perfil') ||
      lineaMinuscula.includes('curriculum') ||
      lineaMinuscula.includes('currículum')
    );
  });

  if (!lineaNombre) {
    return null;
  }

  return lineaNombre
    .replace(/nombre/gi, '')
    .replace(/perfil/gi, '')
    .replace(/curriculum/gi, '')
    .replace(/currículum/gi, '')
    .replace(/:/g, '')
    .trim() || null;
}

async function procesarDocumentoConOcr(rutaArchivo) {
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

  return {
    texto_extraido: textoExtraido,
    rut_detectado: extraerRut(textoExtraido),
    nombre_detectado: extraerNombreBasico(textoExtraido),
    fecha_nacimiento_detectada: extraerFecha(textoExtraido),
    institucion_detectada: null,
    confianza: documento.pages?.[0]?.confidence || null
  };
}

module.exports = {
  procesarDocumentoConOcr
};