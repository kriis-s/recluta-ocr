const express = require('express');
const jwt = require('jsonwebtoken');
const conexion = require('../config/conexion');

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

module.exports = router;