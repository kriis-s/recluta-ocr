const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const conexion = require('../config/conexion');

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

router.post(
  '/cargar',
  verificarPostulante,
  subirArchivo.single('archivo'),
  async (req, res) => {
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

    const tiposValidos = [
      'CEDULA',
      'CURRICULUM',
      'CERTIFICADO_SALUD',
      'CERTIFICADO_PREVISIONAL',
      'OTRO'
    ];

    if (!tiposValidos.includes(tipo_documento)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Tipo de documento no válido.'
      });
    }

    try {
      const rutaArchivo = `archivos/documentos/${req.file.filename}`;

      const [documentosExistentes] = await conexion.query(
        `SELECT id_documento
         FROM documentos
         WHERE id_postulante = ? AND tipo_documento = ?`,
        [req.id_postulante, tipo_documento]
      );

      if (documentosExistentes.length > 0) {
        const id_documento = documentosExistentes[0].id_documento;

        await conexion.query(
          `UPDATE documentos
           SET nombre_archivo = ?,
               ruta_archivo = ?,
               formato = ?,
               fecha_carga = CURRENT_TIMESTAMP,
               estado_procesamiento = ?
           WHERE id_documento = ?`,
          [
            req.file.originalname,
            rutaArchivo,
            req.file.mimetype,
            'PENDIENTE',
            id_documento
          ]
        );

        return res.json({
          ok: true,
          mensaje: 'Documento actualizado correctamente.',
          id_documento,
          nombre_archivo: req.file.originalname,
          estado_procesamiento: 'PENDIENTE'
        });
      }

      const [resultado] = await conexion.query(
        `INSERT INTO documentos
         (id_postulante, id_postulacion, tipo_documento, nombre_archivo, ruta_archivo, formato, estado_procesamiento)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          req.id_postulante,
          null,
          tipo_documento,
          req.file.originalname,
          rutaArchivo,
          req.file.mimetype,
          'PENDIENTE'
        ]
      );

      return res.status(201).json({
        ok: true,
        mensaje: 'Documento cargado correctamente.',
        id_documento: resultado.insertId,
        nombre_archivo: req.file.originalname,
        estado_procesamiento: 'PENDIENTE'
      });

    } catch (error) {
      console.error('Error al cargar documento:', error);

      return res.status(500).json({
        ok: false,
        mensaje: 'Error interno al cargar el documento.'
      });
    }
  }
);

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