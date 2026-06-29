# Recluta OCR

Proyecto de título: **Plataforma web para reclutamiento y gestión documental mediante OCR**.

Este proyecto corresponde al avance de una plataforma web orientada a apoyar procesos de reclutamiento y selección de personal, centralizando la información de postulantes, ofertas laborales, postulaciones, carga documental y resultados obtenidos mediante procesamiento OCR.

## Objetivo del proyecto

Desarrollar una plataforma web que permita apoyar el proceso de reclutamiento mediante dos perfiles de usuario: postulante y reclutador. El sistema considera registro de usuarios, gestión de ofertas laborales, postulación a vacantes, carga de documentos y almacenamiento de información estructurada en una base de datos relacional MySQL.

## Tecnologías utilizadas

* React
* Vite
* JavaScript
* CSS
* Node.js
* Express
* MySQL
* MySQL Workbench
* Google Document AI
* Render

## Estructura del repositorio

```text
recluta-ocr/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controladores/
│   │   ├── middlewares/
│   │   ├── rutas/
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── componentes/
│   │   ├── estilos/
│   │   ├── paginas/
│   │   ├── rutas/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── base_datos/
│   ├── script_base_datos.sql
│   ├── consultas_evidencia.sql
│   └── reclutamiento_ocr.sql.mwb
│
├── documentacion/
│   └── informe_preentrega2.docx
│
├── BITACORA_PROYECTO.md
├── README.md
└── .gitignore
```

## Módulos principales

### Frontend

El frontend fue desarrollado con React y Vite. Contiene las páginas principales del sistema, componentes reutilizables, rutas y estilos CSS propios. El diseño está orientado a una aplicación web responsiva, considerando los perfiles de postulante y reclutador.

### Backend

El backend fue desarrollado con Node.js y Express. Su estructura se encuentra organizada en carpetas para configuración, rutas, controladores y middlewares. Esta capa será responsable de recibir solicitudes del frontend, validar información, gestionar usuarios, postulaciones, ofertas laborales, documentos y comunicación con la base de datos.

### Base de datos

La base de datos fue modelada e implementada en MySQL. El repositorio incluye el script SQL de creación de tablas, consultas de evidencia y el modelo visual generado en MySQL Workbench.

Tablas principales:

* usuarios
* postulantes
* reclutadores
* ofertas_laborales
* estados_postulacion
* postulaciones
* documentos
* datos_ocr

## Instalación y ejecución

### Backend

```bash
cd backend
npm install
npm run dev
```

Crear un archivo `.env` tomando como referencia `.env.example`:

```env
PUERTO=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_clave_mysql
DB_NAME=reclutamiento_ocr
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Base de datos

Para implementar la base de datos, ejecutar el archivo:

```text
base_datos/script_base_datos.sql
```

Para revisar evidencia de tablas y relaciones, utilizar:

```text
base_datos/consultas_evidencia.sql
```

## Estado del proyecto

El proyecto se encuentra en etapa de avance académico. Actualmente cuenta con estructura frontend, backend, modelo relacional MySQL, diccionario de datos, arquitectura propuesta y documentación asociada a la Evaluación Sumativa N°2.

## Autor

Cristian Hormazabal Sobarzo
Ingeniería en Informática
Proyecto de Título
