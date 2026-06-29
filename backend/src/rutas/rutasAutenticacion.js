const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conexion = require('../config/conexion');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { correo, password } = req.body || {};

  if (!correo || !password) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Debe ingresar correo y contraseña.'
    });
  }

  try {
    const [usuarios] = await conexion.query(
      `SELECT id_usuario, correo, password, rol
       FROM usuarios
       WHERE correo = ?`,
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Correo o contraseña incorrectos.'
      });
    }

    const usuario = usuarios[0];

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Correo o contraseña incorrectos.'
      });
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        rol: usuario.rol
      },
      process.env.JWT_SECRETO,
      {
        expiresIn: '2h'
      }
    );

    res.cookie('token_recluta_ocr', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 2 * 60 * 60 * 1000
    });

    return res.json({
      ok: true,
      mensaje: 'Inicio de sesión correcto.',
      usuario: {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al iniciar sesión.'
    });
  }
});

router.get('/perfil', async (req, res) => {
  const token = req.cookies.token_recluta_ocr;

  if (!token) {
    return res.status(401).json({
      ok: false,
      mensaje: 'No existe una sesión activa.'
    });
  }

  try {
    const datosToken = jwt.verify(token, process.env.JWT_SECRETO);

    const [usuarios] = await conexion.query(
      `SELECT id_usuario, correo, rol
       FROM usuarios
       WHERE id_usuario = ?`,
      [datosToken.id_usuario]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Usuario no encontrado.'
      });
    }

    return res.json({
      ok: true,
      mensaje: 'Sesión activa.',
      usuario: usuarios[0]
    });

  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Sesión inválida o expirada.'
    });
  }
});

module.exports = router;