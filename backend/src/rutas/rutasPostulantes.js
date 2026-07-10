const express = require("express");
const bcrypt = require("bcryptjs");
const conexion = require("../config/conexion");

const router = express.Router();

router.post("/registro", async (req, res) => {
  const {
    correo,
    password,
    rut,
    nombres,
    apellido_paterno,
    apellido_materno,
    fecha_nacimiento,
    telefono,
    sexo,
    direccion
  } = req.body;

  if (!correo || !password || !rut || !nombres || !apellido_paterno) {
    return res.status(400).json({
      ok: false,
      mensaje: "Faltan datos obligatorios para registrar el postulante"
    });
  }

  let conexionBaseDatos;

  try {
    conexionBaseDatos = await conexion.getConnection();

    await conexionBaseDatos.beginTransaction();

    const [usuarioExistente] = await conexionBaseDatos.query(
      "SELECT id_usuario FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (usuarioExistente.length > 0) {
      await conexionBaseDatos.rollback();

      return res.status(409).json({
        ok: false,
        mensaje: "El correo ya se encuentra registrado"
      });
    }

    const [postulanteExistente] = await conexionBaseDatos.query(
      "SELECT id_postulante FROM postulantes WHERE rut = ?",
      [rut]
    );

    if (postulanteExistente.length > 0) {
      await conexionBaseDatos.rollback();

      return res.status(409).json({
        ok: false,
        mensaje: "El RUT ya se encuentra registrado"
      });
    }

    const passwordCifrada = await bcrypt.hash(password, 10);

    const [resultadoUsuario] = await conexionBaseDatos.query(
      `INSERT INTO usuarios (correo, password, rol)
       VALUES (?, ?, ?)`,
      [correo, passwordCifrada, "POSTULANTE"]
    );

    const id_usuario = resultadoUsuario.insertId;

    await conexionBaseDatos.query(
      `INSERT INTO postulantes 
       (id_usuario, rut, nombres, apellido_paterno, apellido_materno, fecha_nacimiento, telefono, direccion, sexo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_usuario,
        rut,
        nombres,
        apellido_paterno,
        apellido_materno || null,
        fecha_nacimiento || null,
        telefono || null,
        direccion || null,
        sexo || null
      ]
    );

    await conexionBaseDatos.commit();

    return res.status(201).json({
      ok: true,
      mensaje: "Postulante registrado correctamente",
      id_usuario
    });

  } catch (error) {
    if (conexionBaseDatos) {
      await conexionBaseDatos.rollback();
    }

    console.error("Error al registrar postulante:", error);

    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al registrar postulante"
    });

  } finally {
    if (conexionBaseDatos) {
      conexionBaseDatos.release();
    }
  }
});

module.exports = router;