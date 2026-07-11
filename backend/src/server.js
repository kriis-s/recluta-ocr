const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const rutasPostulantes = require('./rutas/rutasPostulantes');
const rutasAutenticacion = require('./rutas/rutasAutenticacion');
const rutasOfertas = require('./rutas/rutasOfertas');
const rutasPostulaciones = require('./rutas/rutasPostulaciones');
const rutasDocumentos = require('./rutas/rutasDocumentos');
const rutasPanelReclutador = require('./rutas/rutasPanelReclutador');

const conexion = require('./config/conexion');

const app = express();

app.set('trust proxy', 1);

const origenesPermitidos = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function validarOrigen(origen, callback) {
    if (!origen || origenesPermitidos.includes(origen)) {
      return callback(null, true);
    }

    return callback(new Error('Origen no permitido por CORS.'));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get('/api/salud', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'Backend Recluta OCR funcionando correctamente'
  });
});

app.get('/api/probar-conexion', async (req, res) => {
  try {
    const [resultado] = await conexion.query(`
      SELECT 
        DATABASE() AS base_datos,
        NOW() AS fecha_servidor
    `);

    res.json({
      ok: true,
      mensaje: 'Conexión a MySQL exitosa',
      base_datos: resultado[0].base_datos,
      fecha_servidor: resultado[0].fecha_servidor
    });
  } catch (error) {
    console.error('Error al conectar con MySQL:', error);

    res.status(500).json({
      ok: false,
      mensaje: 'Error al conectar con MySQL',
      error: error.message
    });
  }
});

app.get('/api/tablas', async (req, res) => {
  try {
    const [tablas] = await conexion.query('SHOW TABLES');

    res.json({
      ok: true,
      mensaje: 'Tablas obtenidas correctamente',
      tablas
    });
  } catch (error) {
    console.error('Error al obtener tablas:', error);

    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener tablas',
      error: error.message
    });
  }
});

app.use('/api/postulantes', rutasPostulantes);
app.use('/api/autenticacion', rutasAutenticacion);
app.use('/api/ofertas', rutasOfertas);
app.use('/api/postulaciones', rutasPostulaciones);
app.use('/api/documentos', rutasDocumentos);
app.use('/api/reclutador', rutasPanelReclutador);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en puerto ${PORT}`);
});