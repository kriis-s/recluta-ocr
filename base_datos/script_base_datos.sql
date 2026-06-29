-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: reclutamiento_ocr
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `datos_ocr`
--

DROP TABLE IF EXISTS `datos_ocr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `datos_ocr` (
  `id_ocr` int NOT NULL AUTO_INCREMENT,
  `id_documento` int NOT NULL,
  `texto_extraido` longtext,
  `rut_detectado` varchar(12) DEFAULT NULL,
  `nombre_detectado` varchar(150) DEFAULT NULL,
  `fecha_nacimiento_detectada` date DEFAULT NULL,
  `institucion_detectada` varchar(150) DEFAULT NULL,
  `confianza` decimal(5,2) DEFAULT NULL,
  `fecha_procesamiento` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_ocr`),
  UNIQUE KEY `id_documento` (`id_documento`),
  UNIQUE KEY `uq_datos_ocr_documento` (`id_documento`),
  CONSTRAINT `datos_ocr_ibfk_1` FOREIGN KEY (`id_documento`) REFERENCES `documentos` (`id_documento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `documentos`
--

DROP TABLE IF EXISTS `documentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos` (
  `id_documento` int NOT NULL AUTO_INCREMENT,
  `id_postulacion` int NOT NULL,
  `tipo_documento` enum('CEDULA','CURRICULUM','CERTIFICADO_SALUD','CERTIFICADO_PREVISIONAL','OTRO') NOT NULL,
  `nombre_archivo` varchar(255) NOT NULL,
  `ruta_archivo` varchar(255) NOT NULL,
  `formato` varchar(20) DEFAULT NULL,
  `fecha_carga` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado_procesamiento` enum('PENDIENTE','PROCESADO','ERROR') DEFAULT 'PENDIENTE',
  PRIMARY KEY (`id_documento`),
  KEY `id_postulacion` (`id_postulacion`),
  CONSTRAINT `documentos_ibfk_1` FOREIGN KEY (`id_postulacion`) REFERENCES `postulaciones` (`id_postulacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `estados_postulacion`
--

DROP TABLE IF EXISTS `estados_postulacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados_postulacion` (
  `id_estado` int NOT NULL AUTO_INCREMENT,
  `nombre_estado` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_estado`),
  UNIQUE KEY `nombre_estado` (`nombre_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ofertas_laborales`
--

DROP TABLE IF EXISTS `ofertas_laborales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ofertas_laborales` (
  `id_oferta` int NOT NULL AUTO_INCREMENT,
  `id_reclutador` int NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text,
  `area` varchar(100) DEFAULT NULL,
  `ubicacion` varchar(150) DEFAULT NULL,
  `tipo_jornada` varchar(50) DEFAULT NULL,
  `fecha_publicacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('ACTIVA','INACTIVA') DEFAULT 'ACTIVA',
  PRIMARY KEY (`id_oferta`),
  KEY `id_reclutador` (`id_reclutador`),
  CONSTRAINT `ofertas_laborales_ibfk_1` FOREIGN KEY (`id_reclutador`) REFERENCES `reclutadores` (`id_reclutador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `postulaciones`
--

DROP TABLE IF EXISTS `postulaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `postulaciones` (
  `id_postulacion` int NOT NULL AUTO_INCREMENT,
  `id_postulante` int NOT NULL,
  `id_oferta` int NOT NULL,
  `id_estado` int NOT NULL,
  `fecha_postulacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `observacion` text,
  PRIMARY KEY (`id_postulacion`),
  KEY `id_postulante` (`id_postulante`),
  KEY `id_oferta` (`id_oferta`),
  KEY `id_estado` (`id_estado`),
  CONSTRAINT `postulaciones_ibfk_1` FOREIGN KEY (`id_postulante`) REFERENCES `postulantes` (`id_postulante`),
  CONSTRAINT `postulaciones_ibfk_2` FOREIGN KEY (`id_oferta`) REFERENCES `ofertas_laborales` (`id_oferta`),
  CONSTRAINT `postulaciones_ibfk_3` FOREIGN KEY (`id_estado`) REFERENCES `estados_postulacion` (`id_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `postulantes`
--

DROP TABLE IF EXISTS `postulantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `postulantes` (
  `id_postulante` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `rut` varchar(12) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellido_paterno` varchar(100) NOT NULL,
  `apellido_materno` varchar(100) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_postulante`),
  UNIQUE KEY `rut` (`rut`),
  UNIQUE KEY `uq_postulantes_rut` (`rut`),
  UNIQUE KEY `uq_postulantes_usuario` (`id_usuario`),
  CONSTRAINT `postulantes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reclutadores`
--

DROP TABLE IF EXISTS `reclutadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reclutadores` (
  `id_reclutador` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `cargo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_reclutador`),
  UNIQUE KEY `uq_reclutadores_usuario` (`id_usuario`),
  CONSTRAINT `reclutadores_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('POSTULANTE','RECLUTADOR') NOT NULL,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `uq_usuarios_correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-29 15:34:51
