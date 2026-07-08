const express = require('express');
const jwt = require('jsonwebtoken');
const conexion = require('../config/conexion');
const path = require('path');

const router = express.Router();

const verificarReclutador = async (req, res, next) => {
  const token = req.cookies.token_recluta_ocr;

  if (!token) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Debe iniciar sesión para ver el panel del reclutador.'
    });
  }

  try {
    const datosToken = jwt.verify(token, process.env.JWT_SECRETO);

    if (datosToken.rol !== 'RECLUTADOR') {
      return res.status(403).json({
        ok: false,
        mensaje: 'No tiene permisos para acceder al panel del reclutador.'
      });
    }

    const [reclutadores] = await conexion.query(
      `SELECT id_reclutador
       FROM reclutadores
       WHERE id_usuario = ?`,
      [datosToken.id_usuario]
    );

    if (reclutadores.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontró el perfil del reclutador.'
      });
    }

    req.id_reclutador = reclutadores[0].id_reclutador;
    next();

  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Sesión inválida o expirada.'
    });
  }
};

router.get('/panel', verificarReclutador, async (req, res) => {
  try {
    const [resumen] = await conexion.query(
      `SELECT
        COUNT(DISTINCT CASE 
          WHEN o.estado = 'ACTIVA' THEN o.id_oferta 
        END) AS ofertas_activas,

        COUNT(DISTINCT p.id_postulante) AS total_postulantes,

        COUNT(DISTINCT d.id_documento) AS documentos_cargados,

        COUNT(DISTINCT CASE 
          WHEN d.estado_procesamiento = 'PROCESADO' THEN d.id_documento 
        END) AS documentos_procesados
       FROM ofertas_laborales o
       LEFT JOIN postulaciones po ON po.id_oferta = o.id_oferta
       LEFT JOIN postulantes p ON p.id_postulante = po.id_postulante
       LEFT JOIN documentos d ON d.id_postulante = p.id_postulante
       WHERE o.id_reclutador = ?`,
      [req.id_reclutador]
    );

    const [ofertas] = await conexion.query(
      `SELECT
        o.id_oferta,
        o.titulo,
        o.ubicacion,
        o.estado,
        COUNT(po.id_postulacion) AS postulantes
       FROM ofertas_laborales o
       LEFT JOIN postulaciones po ON po.id_oferta = o.id_oferta
       WHERE o.id_reclutador = ?
       GROUP BY o.id_oferta, o.titulo, o.ubicacion, o.estado
       ORDER BY o.id_oferta DESC`,
      [req.id_reclutador]
    );

    const [postulantes] = await conexion.query(
      `SELECT
        po.id_postulacion,
        o.id_oferta,
        p.id_postulante,
        CONCAT_WS(' ', p.nombres, p.apellido_paterno, p.apellido_materno) AS nombre,
        p.rut,
        o.titulo AS oferta,
        COALESCE(e.nombre_estado, 'Recibida') AS estado,
        COUNT(DISTINCT d.id_documento) AS cantidad_documentos,
        COUNT(DISTINCT CASE 
          WHEN d.estado_procesamiento = 'PROCESADO' THEN d.id_documento 
        END) AS documentos_procesados
       FROM postulaciones po
       INNER JOIN postulantes p ON p.id_postulante = po.id_postulante
       INNER JOIN ofertas_laborales o ON o.id_oferta = po.id_oferta
       LEFT JOIN estados_postulacion e ON e.id_estado = po.id_estado
       LEFT JOIN documentos d ON d.id_postulante = p.id_postulante
       WHERE o.id_reclutador = ?
       GROUP BY
        po.id_postulacion,
        o.id_oferta,
        p.id_postulante,
        p.nombres,
        p.apellido_paterno,
        p.apellido_materno,
        p.rut,
        o.titulo,
        e.nombre_estado
       ORDER BY po.fecha_postulacion DESC`,
      [req.id_reclutador]
    );

    return res.json({
      ok: true,
      resumen: resumen[0],
      ofertas,
      postulantes
    });

  } catch (error) {
    console.error('Error al obtener panel del reclutador:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al obtener el panel del reclutador.'
    });
  }
});
router.get('/postulacion/:id_postulacion', verificarReclutador, async (req, res) => {
  const { id_postulacion } = req.params;

  try {
    const [postulaciones] = await conexion.query(
      `SELECT
        po.id_postulacion,
        po.fecha_postulacion,
        po.observacion,
        ep.nombre_estado AS estado,
        p.id_postulante,
        p.rut,
        p.nombres,
        p.apellido_paterno,
        p.apellido_materno,
        p.telefono,
        p.direccion,
        p.fecha_nacimiento,
        u.correo,
        o.id_oferta,
        o.titulo AS oferta,
        o.area,
        o.ubicacion,
        o.tipo_jornada
      FROM postulaciones po
      INNER JOIN postulantes p ON po.id_postulante = p.id_postulante
      INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
      INNER JOIN ofertas_laborales o ON po.id_oferta = o.id_oferta
      INNER JOIN estados_postulacion ep ON po.id_estado = ep.id_estado
      WHERE po.id_postulacion = ?`,
      [id_postulacion]
    );

    if (postulaciones.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontró la postulación solicitada.'
      });
    }

    const [documentos] = await conexion.query(
      `SELECT
        d.id_documento,
        d.tipo_documento,
        d.nombre_archivo,
        d.ruta_archivo,
        d.formato,
        d.fecha_carga,
        d.estado_procesamiento,
        ocr.id_ocr,
        ocr.rut_detectado,
        ocr.nombre_detectado,
        ocr.fecha_nacimiento_detectada,
        ocr.institucion_detectada,
        ocr.confianza,
        ocr.fecha_procesamiento
      FROM documentos d
      LEFT JOIN datos_ocr ocr ON d.id_documento = ocr.id_documento
      WHERE d.id_postulante = ?
      ORDER BY d.fecha_carga DESC`,
      [postulaciones[0].id_postulante]
    );
    const [estados] = await conexion.query(
      `SELECT id_estado, nombre_estado
      FROM estados_postulacion
      ORDER BY id_estado ASC`
    );
    return res.json({
      ok: true,
      postulacion: postulaciones[0],
      documentos,
      estados
    });

  } catch (error) {
    console.error('Error al obtener detalle de postulación:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al obtener el detalle de la postulación.'
    });
  }
});
router.put('/postulacion/:id_postulacion/estado', verificarReclutador, async (req, res) => {
  const { id_postulacion } = req.params;
  const { id_estado, observacion } = req.body || {};

  if (!id_estado) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Debe seleccionar un estado para la postulación.'
    });
  }

  try {
    const [estados] = await conexion.query(
      `SELECT id_estado, nombre_estado
       FROM estados_postulacion
       WHERE id_estado = ?`,
      [id_estado]
    );

    if (estados.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'El estado seleccionado no existe.'
      });
    }

    const [postulaciones] = await conexion.query(
      `SELECT po.id_postulacion
       FROM postulaciones po
       INNER JOIN ofertas_laborales o ON po.id_oferta = o.id_oferta
       WHERE po.id_postulacion = ?
       AND o.id_reclutador = ?`,
      [id_postulacion, req.id_reclutador]
    );

    if (postulaciones.length === 0) {
      return res.status(403).json({
        ok: false,
        mensaje: 'No tiene permisos para modificar esta postulación.'
      });
    }

    await conexion.query(
      `UPDATE postulaciones
       SET id_estado = ?,
           observacion = ?
       WHERE id_postulacion = ?`,
      [
        id_estado,
        observacion?.trim() || null,
        id_postulacion
      ]
    );

    return res.json({
      ok: true,
      mensaje: 'Estado de postulación actualizado correctamente.',
      estado: estados[0].nombre_estado
    });

  } catch (error) {
    console.error('Error al cambiar estado de postulación:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al cambiar el estado de la postulación.'
    });
  }
});

router.get('/documento/:id_documento/ver', verificarReclutador, async (req, res) => {
  const { id_documento } = req.params;

  try {
    const [documentos] = await conexion.query(
      `SELECT
        d.id_documento,
        d.nombre_archivo,
        d.ruta_archivo,
        d.formato
       FROM documentos d
       INNER JOIN postulantes p ON d.id_postulante = p.id_postulante
       INNER JOIN postulaciones po ON po.id_postulante = p.id_postulante
       INNER JOIN ofertas_laborales o ON po.id_oferta = o.id_oferta
       WHERE d.id_documento = ?
       AND o.id_reclutador = ?
       LIMIT 1`,
      [id_documento, req.id_reclutador]
    );

    if (documentos.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontró el documento o no tiene permisos para verlo.'
      });
    }

    const documento = documentos[0];

    const rutaArchivo = path.join(
      __dirname,
      '../../',
      documento.ruta_archivo
    );

    return res.sendFile(rutaArchivo);

  } catch (error) {
    console.error('Error al visualizar documento:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al visualizar el documento.'
    });
  }
});
module.exports = router;