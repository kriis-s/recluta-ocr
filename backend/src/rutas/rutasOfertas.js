const express = require('express');
const jwt = require('jsonwebtoken');
const conexion = require('../config/conexion');

const router = express.Router();

// Además de validar el token, se recupera el perfil usado para crear la oferta.
const verificarReclutador = async (req, res, next) => {
  const token = req.cookies.token_recluta_ocr;
  if (!token) {
    return res.status(401).json({
      ok: false,
      error: 'No existe una sesion activa'
    });
  }

  try {
    const datosToken = jwt.verify(token, process.env.JWT_SECRETO);

    if (datosToken.rol !== 'RECLUTADOR') {
      return res.status(403).json({
        ok: false,
        error: 'No tiene permisos para crear ofertas laborales.'
      });
    }

    const [reclutadores] = await conexion.query(
      `SELECT id_reclutador
       FROM reclutadores
       WHERE id_usuario = ?`,
      [datosToken.id_usuario]
    );
    if (reclutadores.length === 0) {
      return res.status(403).json({ ok: false, error: 'No se encontró el perfil de reclutador.' });
    }

    req.id_reclutador = reclutadores[0].id_reclutador;
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, error: 'Sesión inválida o expirada.' });
  }
};

router.post('/crear', verificarReclutador, async (req, res) => {
  const {
    titulo,
    descripcion,
    area,
    ubicacion,
    tipo_jornada,
    estado,
    empresa,
    sueldo
  } = req.body || {};

  if (!titulo || !titulo.trim()) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Debe ingresar el título de la oferta laboral.'
    });
  }

  if (!empresa || !empresa.trim()) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Debe ingresar la empresa donde se trabajará.'
    });
  }

  if (!sueldo || Number(sueldo) <= 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Debe ingresar un sueldo válido para la oferta laboral.'
    });
  }

  try {
    const estadoOferta = estado || 'ACTIVA';

    await conexion.query(
      `INSERT INTO ofertas_laborales ( id_reclutador, titulo, empresa, sueldo, descripcion, area, ubicacion, tipo_jornada, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.id_reclutador,
        titulo.trim(),
        empresa.trim(),
        Number(sueldo),
        descripcion?.trim() || null,
        area?.trim() || null,
        ubicacion?.trim() || null,
        tipo_jornada?.trim() || null,
        estadoOferta
      ]
    );

    return res.status(201).json({
      ok: true,
      mensaje: 'Oferta laboral creada exitosamente.'
    });

  } catch (error) {
    console.error('Error al crear la oferta laboral:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor.'
    });
  }
});

router.get('/listar', async (req, res) => {
  try {
    const [ofertas] = await conexion.query(
      `SELECT id_oferta, titulo, area, ubicacion, tipo_jornada, descripcion, estado, fecha_publicacion, empresa, sueldo
       FROM ofertas_laborales
       WHERE estado = 'ACTIVA'
       ORDER BY fecha_publicacion DESC`
    );

    // La descripción guardada contiene secciones que se separan para el listado.
    const ofertasFormateadas = ofertas.map(function formatearOferta(oferta) {
      const descripcion = oferta.descripcion || "";
      const modalidadEncontrada = descripcion.match(/Modalidad:\s*(.+)/i);
      const modalidad = modalidadEncontrada ? modalidadEncontrada[1].trim() : "No indicada";

      const descripcionLimpia = descripcion
        .replace(/Modalidad:.*(\r?\n)?/i, "")
        .replace(/Descripción:/i, "")
        .replace(/Requisitos:[\s\S]*/i, "")
        .trim();

      return {
        id: oferta.id_oferta,
        titulo: oferta.titulo,
        area: oferta.area,
        ubicacion: oferta.ubicacion,
        empresa: oferta.empresa,
        sueldo: oferta.sueldo,
        jornada: oferta.tipo_jornada,
        modalidad: modalidad,
        estado: oferta.estado === "ACTIVA" ? "Activa" : "Inactiva",
        descripcion: descripcionLimpia || descripcion,
        fecha_publicacion: oferta.fecha_publicacion
      };
    });

    return res.json({
      ok: true,
      ofertas: ofertasFormateadas
    });

  } catch (error) {
    console.error("Error al listar ofertas laborales:", error);

    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al listar las ofertas laborales."
    });
  }
});

router.get('/detalle/:id_oferta', async function obtenerDetalleOferta(req, res) {
  try {
    const { id_oferta } = req.params;

    if (!id_oferta || Number.isNaN(Number(id_oferta))) {
      return res.status(400).json({
        mensaje: 'El identificador de la oferta no es válido.'
      });
    }

    const [ofertas] = await conexion.query(
      `SELECT
        id_oferta,
        id_reclutador,
        titulo,
        empresa,
        sueldo,
        descripcion,
        area,
        ubicacion,
        tipo_jornada,
        fecha_publicacion,
        estado
      FROM ofertas_laborales
      WHERE id_oferta = ?`,
      [id_oferta]
    );

    if (ofertas.length === 0) {
      return res.status(404).json({
        mensaje: 'La oferta laboral no existe.'
      });
    }

    return res.json({
      oferta: ofertas[0]
    });
  } catch (error) {
    console.error('Error al obtener detalle de oferta:', error);
    return res.status(500).json({
      mensaje: 'Error interno al obtener el detalle de la oferta.'
    });
  }
});

module.exports = router;
