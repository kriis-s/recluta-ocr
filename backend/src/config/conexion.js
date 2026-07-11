const mysql = require('mysql2/promise');
require('dotenv').config();

const configuracionConexion = {
  user: process.env.DB_USER || process.env.MYSQLUSER,
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

if (process.env.INSTANCE_CONNECTION_NAME) {
  configuracionConexion.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
} else {
  configuracionConexion.host = process.env.DB_HOST || process.env.MYSQLHOST;
  configuracionConexion.port = Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306);
}

const conexion = mysql.createPool(configuracionConexion);

module.exports = conexion;