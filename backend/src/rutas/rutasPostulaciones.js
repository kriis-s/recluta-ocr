const express = require('express');
const jwt = require('jsonwebtoken');
const conexion = require('../config/conexion');

const router = express.Router();

const verificarPostulante = async (req, res, next) => {
  const token = req.cookies.token_recluta_ocr;

  if (!token) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Debe iniciar sesión para postular.'
    });
  }

  try {
    const datosToken = jwt.verify(token, process.env.JWT_SECRETO);

    if (datosToken.rol !== 'POSTULANTE') {
      return res.status(403).json({
        ok: false,
        mensaje: 'Solo los postulantes pueden postular a ofertas laborales.'
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

router.post('/crear', verificarPostulante, async (req, res) => {
  const { id_oferta } = req.body || {};

  if (!id_oferta) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Debe seleccionar una oferta laboral.'
    });
  }

  try {
    const [ofertas] = await conexion.query(
      `SELECT id_oferta
       FROM ofertas_laborales
       WHERE id_oferta = ? AND estado = 'ACTIVA'`,
      [id_oferta]
    );

    if (ofertas.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'La oferta laboral no existe o no se encuentra activa.'
      });
    }

    const [postulacionExistente] = await conexion.query(
      `SELECT id_postulacion
       FROM postulaciones
       WHERE id_postulante = ? AND id_oferta = ?`,
      [req.id_postulante, id_oferta]
    );

    if (postulacionExistente.length > 0) {
      return res.status(409).json({
        ok: false,
        mensaje: 'Ya postulaste a esta oferta laboral.'
      });
    }

    const [estados] = await conexion.query(
      `SELECT id_estado
       FROM estados_postulacion
       WHERE nombre_estado = 'Recibida'
       LIMIT 1`
    );

    if (estados.length === 0) {
      return res.status(500).json({
        ok: false,
        mensaje: 'No existe el estado inicial Recibida.'
      });
    }

    const id_estado = estados[0].id_estado;

    const [resultado] = await conexion.query(
      `INSERT INTO postulaciones
       (id_postulante, id_oferta, id_estado, observacion)
       VALUES (?, ?, ?, ?)`,
      [
        req.id_postulante,
        id_oferta,
        id_estado,
        'Postulación ingresada desde la plataforma web.'
      ]
    );

    return res.status(201).json({
      ok: true,
      mensaje: 'Postulación realizada correctamente.',
      id_postulacion: resultado.insertId
    });

  } catch (error) {
    console.error('Error al crear postulación:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al crear la postulación.'
    });
  }
});

module.exports = router;