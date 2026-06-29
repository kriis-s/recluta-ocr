# BITÁCORA DEL PROYECTO

## AVANCE 01 - 11/06/2026

### Nombre del Proyecto

Plataforma Web para Reclutamiento y Gestión Documental mediante OCR

### Objetivo

Desarrollar una plataforma web que permita gestionar postulantes, ofertas laborales y documentos mediante tecnología OCR.

### Tecnologías definidas

* Frontend: React + Vite
* Backend: Node.js + Express
* Base de Datos: MySQL
* OCR: Google Document AI
* Control de versiones: Git (pendiente)
* Hosting: Pendiente

### Actividades realizadas

1. Creación carpeta raíz del proyecto:

   * recluta-ocr

2. Inicialización del frontend con Vite:

Comando ejecutado:

npm create vite@latest frontend

Opciones seleccionadas:

* Framework: React
* Variant: JavaScript

3. Instalación automática de dependencias:

npm install

4. Ejecución del servidor de desarrollo:

npm run dev

Resultado:

* Aplicación React funcionando correctamente.
* URL local: http://localhost:5173

### Estructura actual

recluta-ocr/
└── frontend/

### Estado del proyecto

Frontend base operativo.

### Próximas tareas

* Instalar React Router.
* Crear estructura profesional de carpetas.
* Crear navegación principal.
* Diseñar base de datos.
* Crear backend Express.

## AVANCE 02 - 11/06/2026

### Limpieza inicial del proyecto React

Se eliminaron los archivos de ejemplo generados por Vite para comenzar el desarrollo desde una estructura limpia.

Archivos eliminados:

* src/App.css
* src/index.css
* src/assets/

Se modificaron:

* App.jsx
* main.jsx

Objetivo:

* Eliminar componentes de demostración.
* Mantener una base mínima para comenzar el desarrollo del sistema de reclutamiento.

### Dependencias

Instalación de React Router para gestionar la navegación entre páginas:

npm install react-router-dom

Estado:

* Frontend limpio y preparado para implementar arquitectura de navegación.
### Estándar de nomenclatura definido

Se establece como criterio de desarrollo utilizar idioma español para todos los elementos del proyecto:

* Carpetas.
* Componentes React.
* Páginas.
* Variables.
* Tablas de base de datos.
* Comentarios.
* Documentación técnica.

Objetivo:
Mantener coherencia con la documentación académica, facilitar el mantenimiento del código y mejorar la comprensión durante la presentación del proyecto de título.
## AVANCE 03 - 11/06/2026

### Preparación de arquitectura del proyecto

Se realizó la limpieza del proyecto React generado por Vite.

Archivos eliminados:

* App.css
* index.css
* carpeta assets

Se mantuvieron:

* App.jsx
* main.jsx

### Estándar de desarrollo

Se define utilizar nomenclatura en español para:

* Carpetas
* Componentes
* Páginas
* Variables
* Tablas de base de datos
* Comentarios
* Documentación

### Dependencias instaladas

React Router DOM

Comando ejecutado:

npm install react-router-dom

Estado:
Proyecto preparado para implementar navegación y arquitectura de páginas.
## AVANCE 04 - 11/06/2026

### Implementación de navegación

Se configuró React Router para administrar la navegación de la aplicación.

Rutas implementadas:

* /
* /iniciar-sesion
* /registro
* *

Archivos creados:

src/rutas/RutasAplicacion.jsx

Páginas creadas:

* Inicio.jsx
* IniciarSesion.jsx
* Registro.jsx
* NoEncontrado.jsx

### Problema detectado

La aplicación mostraba pantalla en blanco al cargar BrowserRouter.

Error:

Invalid hook call
Cannot read properties of null (reading 'useRef')

### Diagnóstico

Se verificaron las dependencias instaladas mediante:

npm ls react react-dom react-router-dom

Resultado:
React Router DOM no estaba instalado correctamente.

### Solución aplicada

npm install react-router-dom

Resultado:
La navegación quedó operativa y las páginas cargan correctamente.
## AVANCE 05 - 11/06/2026

### Sprint 1 Finalizado

Se implementó la arquitectura inicial del frontend.

Funcionalidades completadas:

* Navegación mediante React Router.
* Menú principal reutilizable.
* Página Inicio.
* Página Iniciar Sesión.
* Página Registro.
* Página No Encontrado (404).

Estructura creada:

src/
├── componentes/
├── estilos/
├── paginas/
├── rutas/
├── servicios/
└── recursos/

### Correcciones realizadas

Se corrigió un error de React Router relacionado con el uso de Link fuera del contexto BrowserRouter.

### Resultado

El proyecto cuenta con una estructura base escalable para continuar el desarrollo de:

* Autenticación.
* Gestión de postulantes.
* Gestión de ofertas laborales.
* Carga documental.
* Integración OCR.
* Exportación Excel.
## AVANCE 06 - 11/06/2026

### Inicio Sprint 2

Se inició la construcción del diseño visual base del frontend.

Archivos creados:

* src/estilos/global.css

Archivos modificados:

* src/main.jsx
* src/paginas/Inicio.jsx

Objetivo:
Crear estilos globales propios en CSS, manteniendo el cumplimiento del requisito académico de no utilizar Bootstrap ni plantillas completas.

Estado:
Página de inicio preparada para incorporar diseño profesional y responsive.

## Bitácora de avance – 25/06/2026

### Actividad realizada

Se avanzó en la conexión inicial entre el backend del proyecto y la base de datos MySQL. Se decidió detener el uso de datos simulados en `localStorage`, ya que el proyecto debe trabajar conectado a una base de datos real.

### Avances técnicos

* Se confirmó que la base de datos del proyecto se llama `reclutamiento_ocr`.
* Se verificó que la base contiene las siguientes tablas:

  * `usuarios`
  * `postulantes`
  * `reclutadores`
  * `ofertas_laborales`
  * `postulaciones`
  * `documentos`
  * `datos_ocr`
  * `estados_postulacion`
* Se creó un usuario específico de MySQL para el backend, evitando utilizar directamente el usuario `root`.
* Se configuró el archivo `.env` del backend con los datos de conexión.
* Se creó el archivo `src/config/conexion.js` para centralizar la conexión con MySQL.
* Se configuró el archivo `src/server.js` con Express, CORS y rutas iniciales de prueba.
* Se validó correctamente el funcionamiento del backend mediante la ruta `/api/salud`.
* Se validó correctamente la conexión a MySQL mediante la ruta `/api/probar-conexion`.

### Resultado obtenido

El backend quedó funcionando en `http://localhost:3001` y se confirmó la conexión exitosa con la base de datos `reclutamiento_ocr`.

### Pendiente para la siguiente jornada

* Revisar la estructura real de las tablas mediante `DESCRIBE`.
* Comenzar la creación de rutas reales del backend.
* Implementar primero el registro de postulantes conectado a MySQL.
* Luego conectar el formulario `Registro.jsx` del frontend con el backend.
