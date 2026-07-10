const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const conexion = require('../config/conexion');
const { procesarDocumentoConOcr } = require('../servicios/servicioOcr');

const router = express.Router();

const carpetaDocumentos = path.join(__dirname, '../../archivos/documentos');


if (!fs.existsSync(carpetaDocumentos)) {
  fs.mkdirSync(carpetaDocumentos, { recursive: true });
}

const almacenamiento = multer.diskStorage({
  destination: function definirDestino(req, file, cb) {
    cb(null, carpetaDocumentos);
  },
  filename: function definirNombreArchivo(req, file, cb) {
    const extension = path.extname(file.originalname);
    const nombreBase = path.basename(file.originalname, extension);
    const nombreLimpio = nombreBase
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '');

    const nombreFinal = `${Date.now()}-${nombreLimpio}${extension}`;
    cb(null, nombreFinal);
  }
});

const filtroArchivo = function validarArchivo(req, file, cb) {
  const tiposPermitidos = [
    'application/pdf',
    'image/jpeg',
    'image/png'
  ];

  if (!tiposPermitidos.includes(file.mimetype)) {
    return cb(new Error('El archivo debe ser PDF, JPG o PNG.'));
  }

  cb(null, true);
};

const subirArchivo = multer({
  storage: almacenamiento,
  fileFilter: filtroArchivo,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

const verificarPostulante = async (req, res, next) => {
  const token = req.cookies.token_recluta_ocr;

  if (!token) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Debe iniciar sesión para cargar documentos.'
    });
  }

  try {
    const datosToken = jwt.verify(token, process.env.JWT_SECRETO);

    if (datosToken.rol !== 'POSTULANTE') {
      return res.status(403).json({
        ok: false,
        mensaje: 'Solo los postulantes pueden cargar documentos.'
      });
    }

    const [postulantes] = await conexion.query(
      `SELECT id_postulante
       FROM postulantes
       WHERE id_usuario = ?`,
      [datosToken.id_usuario]
    );

    if (postulantes.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontró el perfil del postulante.'
      });
    }

    req.id_postulante = postulantes[0].id_postulante;
    next();

  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Sesión inválida o expirada.'
    });
  }
};

router.post('/cargar', verificarPostulante, subirArchivo.single('archivo'), async (req, res) => {
  const { tipo_documento } = req.body;

  if (!tipo_documento) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Debe seleccionar el tipo de documento.'
    });
  }

  if (!req.file) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Debe adjuntar un archivo.'
    });
  }

  const tiposPermitidos = [
    'CEDULA',
    'CURRICULUM',
    'CERTIFICADO_SALUD',
    'CERTIFICADO_PREVISIONAL',
    'OTRO'
  ];

  if (!tiposPermitidos.includes(tipo_documento)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El tipo de documento seleccionado no es válido.'
    });
  }

  const nombreArchivo = req.file.filename;
  const rutaArchivo = `archivos/documentos/${nombreArchivo}`;
  const formato = req.file.mimetype;

  try {
    const [documentosExistentes] = await conexion.query(
      `SELECT id_documento
       FROM documentos
       WHERE id_postulante = ?
       AND tipo_documento = ?`,
      [req.id_postulante, tipo_documento]
    );

    let idDocumento;

    if (documentosExistentes.length > 0) {
      idDocumento = documentosExistentes[0].id_documento;

      await conexion.query(
        `UPDATE documentos
         SET nombre_archivo = ?,
             ruta_archivo = ?,
             formato = ?,
             fecha_carga = CURRENT_TIMESTAMP,
             estado_procesamiento = 'PENDIENTE'
         WHERE id_documento = ?`,
        [
          nombreArchivo,
          rutaArchivo,
          formato,
          idDocumento
        ]
      );

    } else {
      const [resultado] = await conexion.query(
        `INSERT INTO documentos (
          id_postulante,
          id_postulacion,
          tipo_documento,
          nombre_archivo,
          ruta_archivo,
          formato,
          estado_procesamiento
        )
        VALUES (?, NULL, ?, ?, ?, ?, 'PENDIENTE')`,
        [
          req.id_postulante,
          tipo_documento,
          nombreArchivo,
          rutaArchivo,
          formato
        ]
      );

      idDocumento = resultado.insertId;
    }

    if (tipo_documento === 'CURRICULUM') {
      try {
        const [postulantes] = await conexion.query(
          `SELECT
            id_postulante,
            rut,
            nombres,
            apellido_paterno,
            apellido_materno
          FROM postulantes
          WHERE id_postulante = ?
          LIMIT 1`,
          [req.id_postulante]
        );

        const datosPostulante = postulantes[0];

        const rutaArchivoFisica = path.join(
          __dirname,
          '../../',
          rutaArchivo
        );

        const resultadoOcr = await procesarDocumentoConOcr(
          rutaArchivoFisica,
          datosPostulante,
          tipo_documento
        );

        await conexion.query(
          `INSERT INTO datos_ocr (
            id_documento,
            texto_extraido,
            rut_detectado,
            nombre_detectado,
            fecha_nacimiento_detectada,
            fecha_emision_detectada,
            institucion_detectada,
            tipo_institucion,
            confianza,
            coincide_rut,
            coincide_nombre,
            observacion_validacion,
            fecha_procesamiento
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            texto_extraido = VALUES(texto_extraido),
            rut_detectado = VALUES(rut_detectado),
            nombre_detectado = VALUES(nombre_detectado),
            fecha_nacimiento_detectada = VALUES(fecha_nacimiento_detectada),
            fecha_emision_detectada = VALUES(fecha_emision_detectada),
            institucion_detectada = VALUES(institucion_detectada),
            tipo_institucion = VALUES(tipo_institucion),
            confianza = VALUES(confianza),
            coincide_rut = VALUES(coincide_rut),
            coincide_nombre = VALUES(coincide_nombre),
            observacion_validacion = VALUES(observacion_validacion),
            fecha_procesamiento = NOW()`,
          [
            idDocumento,
            resultadoOcr.texto_extraido,
            resultadoOcr.rut_detectado,
            resultadoOcr.nombre_detectado,
            resultadoOcr.fecha_nacimiento_detectada,
            resultadoOcr.fecha_emision_detectada,
            resultadoOcr.institucion_detectada,
            resultadoOcr.tipo_institucion,
            resultadoOcr.confianza,
            resultadoOcr.coincide_rut ? 1 : 0,
            resultadoOcr.coincide_nombre ? 1 : 0,
            resultadoOcr.observacion_validacion
          ]
        );

        await conexion.query(
          `UPDATE documentos
          SET estado_procesamiento = 'PROCESADO'
          WHERE id_documento = ?`,
          [idDocumento]
        );

        return res.json({
          ok: true,
          mensaje: 'Currículum cargado, procesado y validado correctamente con OCR.',
          documento: {
            id_documento: idDocumento,
            tipo_documento,
            nombre_archivo: nombreArchivo,
            estado_procesamiento: 'PROCESADO'
          },
          resultado_ocr: resultadoOcr
        });

      } catch (errorOcr) {
        console.error('Error al procesar currículum con OCR:', errorOcr);

        await conexion.query(
          `UPDATE documentos
          SET estado_procesamiento = 'ERROR'
          WHERE id_documento = ?`,
          [idDocumento]
        );

        return res.json({
          ok: true,
          mensaje: 'El currículum fue cargado, pero ocurrió un error al procesarlo con OCR.',
          documento: {
            id_documento: idDocumento,
            tipo_documento,
            nombre_archivo: nombreArchivo,
            estado_procesamiento: 'ERROR'
          }
        });
      }
    }

    return res.json({
      ok: true,
      mensaje: 'Documento cargado correctamente. El OCR se procesará solo si el postulante es seleccionado.',
      documento: {
        id_documento: idDocumento,
        tipo_documento,
        nombre_archivo: nombreArchivo,
        estado_procesamiento: 'PENDIENTE'
      }
    });

  } catch (error) {
    console.error('Error al cargar documento:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al cargar el documento.'
    });
  }
});

router.get('/mis-documentos', verificarPostulante, async (req, res) => {
  try {
    const [documentos] = await conexion.query(
      `SELECT 
        id_documento,
        tipo_documento,
        nombre_archivo,
        ruta_archivo,
        formato,
        DATE_FORMAT(fecha_carga, '%d/%m/%Y %H:%i') AS fecha_carga,
        estado_procesamiento
       FROM documentos
       WHERE id_postulante = ?
       ORDER BY fecha_carga DESC`,
      [req.id_postulante]
    );

    return res.json({
      ok: true,
      documentos
    });

  } catch (error) {
    console.error('Error al obtener documentos del postulante:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al obtener los documentos.'
    });
  }
});

module.exports = router;