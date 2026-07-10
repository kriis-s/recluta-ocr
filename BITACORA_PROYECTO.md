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

## AVANCE 07 - 26/06/2026

### Conexión funcional entre frontend, backend y MySQL

### Actividad realizada

Se continuó con la conexión real del sistema, dejando de lado los datos de prueba en el frontend. El objetivo fue comenzar a utilizar la base de datos MySQL como fuente principal de información del proyecto.

### Avances técnicos

* Se configuró el backend con Express.
* Se validó la conexión entre Node.js y MySQL.
* Se habilitó CORS para permitir la comunicación entre el frontend y el backend.
* Se crearon rutas iniciales para validar el estado del servidor.
* Se conectó el formulario de registro de postulantes con la base de datos.
* Se implementó el registro real de usuarios y postulantes.
* Se comenzó a separar la lógica del backend mediante archivos de rutas.

### Resultado obtenido

El sistema ya permite registrar postulantes en la base de datos `reclutamiento_ocr`, dejando atrás el uso de información simulada.

### Pendiente para la siguiente jornada

* Implementar inicio de sesión.
* Agregar autenticación mediante roles.
* Proteger rutas privadas.
* Crear flujo diferenciado para postulante y reclutador.


## AVANCE 08 - 01/07/2026

### Implementación de autenticación y roles

### Actividad realizada

Se implementó el sistema de autenticación del proyecto, permitiendo el ingreso de usuarios según su rol dentro de la plataforma.

### Avances técnicos

* Se creó la ruta de inicio de sesión.
* Se validaron credenciales contra la tabla `usuarios`.
* Se incorporó cifrado de contraseñas mediante bcrypt.
* Se implementó comparación segura entre la contraseña ingresada y el hash almacenado.
* Se configuró autenticación mediante JWT.
* Se almacenó el token en cookie HTTP Only para mejorar la seguridad.
* Se creó una ruta para obtener el perfil del usuario autenticado.
* Se agregó cierre de sesión.
* Se implementó protección de rutas en el frontend mediante `RutaProtegida`.

### Resultado obtenido

El sistema permite iniciar sesión de forma segura y redirigir al usuario según su rol: `POSTULANTE` o `RECLUTADOR`.

### Pendiente para la siguiente jornada

* Conectar paneles principales.
* Crear gestión de ofertas laborales.
* Validar permisos del reclutador.
* Conectar las vistas con información real de MySQL.


## AVANCE 09 - 03/07/2026

### Gestión de ofertas laborales

### Actividad realizada

Se implementó el módulo de ofertas laborales para el perfil reclutador.

### Avances técnicos

* Se creó la ruta backend para registrar ofertas laborales.
* Se validó que solo usuarios con rol `RECLUTADOR` puedan crear ofertas.
* Se conectó el formulario `CrearOfertaLaboral.jsx` con el backend.
* Se guardaron ofertas laborales reales en la tabla `ofertas_laborales`.
* Se creó la ruta para listar ofertas disponibles.
* Se conectó la página `OfertasLaborales.jsx` con la información almacenada en MySQL.
* Se corrigieron errores de variables no definidas y estados del frontend.
* Se validó la visualización correcta de ofertas en la página pública.

### Resultado obtenido

El sistema permite que un reclutador cree ofertas laborales y que los postulantes puedan visualizarlas desde el frontend.

### Pendiente para la siguiente jornada

* Implementar postulación a ofertas.
* Asociar postulantes con ofertas laborales.
* Crear visualización de postulaciones en panel postulante y reclutador.


## AVANCE 10 - 04/07/2026

### Implementación de postulaciones

### Actividad realizada

Se conectó el proceso de postulación entre el frontend, backend y base de datos.

### Avances técnicos

* Se creó la ruta backend para registrar postulaciones.
* Se validó que solo usuarios postulantes puedan postular.
* Se asoció cada postulación con un postulante y una oferta laboral.
* Se evitó la duplicidad de postulaciones a una misma oferta.
* Se conectó el botón de postulación desde el frontend.
* Se creó la ruta para listar las postulaciones del postulante autenticado.
* Se eliminó el uso de datos de prueba en `PanelPostulante.jsx`.
* Se mostraron postulaciones reales desde la tabla `postulaciones`.

### Resultado obtenido

El postulante puede postular a ofertas laborales reales y visualizar el estado de sus postulaciones desde su panel.

### Pendiente para la siguiente jornada

* Implementar carga documental.
* Asociar documentos al postulante.
* Preparar la integración OCR para análisis documental.


## AVANCE 11 - 05/07/2026

### Carga de documentos del postulante

### Actividad realizada

Se implementó el módulo de carga documental para que los postulantes puedan adjuntar archivos al sistema.

### Avances técnicos

* Se creó la ruta `POST /api/documentos/cargar`.
* Se configuró Multer para recibir archivos PDF e imágenes.
* Se creó la carpeta `backend/archivos/documentos`.
* Se asociaron los documentos cargados al `id_postulante`.
* Se definieron tipos de documentos:
  * Cédula de identidad.
  * Currículum.
  * Certificado de salud.
  * Certificado previsional.
  * Otro.
* Se registró la información del archivo en la tabla `documentos`.
* Se creó la ruta para listar los documentos del postulante autenticado.
* Se conectó la visualización de documentos en `PanelPostulante.jsx`.

### Resultado obtenido

El sistema permite cargar y registrar documentos reales asociados al postulante autenticado.

### Pendiente para la siguiente jornada

* Mostrar documentos al reclutador.
* Crear detalle de postulación.
* Permitir revisión individual de postulantes.
* Preparar procesamiento OCR.


## AVANCE 12 - 08/07/2026

### Panel reclutador y revisión de postulantes

### Actividad realizada

Se fortaleció el panel del reclutador para permitir la revisión de ofertas, postulantes y documentos cargados.

### Avances técnicos

* Se creó la ruta `GET /api/reclutador/panel`.
* Se conectó el panel reclutador con información real de MySQL.
* Se mostraron ofertas laborales creadas por el reclutador.
* Se mostraron postulantes asociados a las ofertas laborales.
* Se agregó resumen general del panel:
  * Ofertas activas.
  * Total de postulantes.
  * Documentos cargados.
  * Documentos procesados.
* Se implementó filtro de postulantes por oferta laboral.
* Se creó la vista `DetallePostulante.jsx`.
* Se agregó ruta frontend para revisar una postulación específica.
* Se creó la ruta backend `GET /api/reclutador/postulacion/:id_postulacion`.
* Se mostraron datos del postulante, oferta asociada y documentos cargados.
* Se creó ruta protegida para visualizar documentos cargados.
* Se agregó botón “Ver documento” para abrir archivos PDF o imágenes desde el detalle.

### Resultado obtenido

El reclutador puede revisar postulantes reales, consultar sus documentos y acceder al detalle de cada postulación.

### Pendiente para la siguiente jornada

* Implementar cambio de estado de postulación.
* Integrar OCR real mediante Google Document AI.
* Guardar resultados OCR en la base de datos.


## AVANCE 13 - 08/07/2026

### Cambio de estado de postulaciones

### Actividad realizada

Se implementó la funcionalidad para que el reclutador pueda actualizar el estado de una postulación.

### Avances técnicos

* Se creó la ruta `PUT /api/reclutador/postulacion/:id_postulacion/estado`.
* Se validó que el reclutador solo pueda modificar postulaciones asociadas a sus propias ofertas.
* Se conectó el cambio de estado desde `DetallePostulante.jsx`.
* Se cargaron estados desde la tabla `estados_postulacion`.
* Se agregó campo de observación para registrar comentarios del reclutador.
* Se permitió actualizar estados como:
  * Recibida.
  * En revisión.
  * Seleccionado.
  * Rechazado.

### Resultado obtenido

El reclutador puede gestionar el avance de cada postulación desde la plataforma, dejando registro del estado y observaciones.

### Pendiente para la siguiente jornada

* Integrar OCR para currículum.
* Procesar documentos mediante Google Document AI.
* Mostrar texto extraído al reclutador.


## AVANCE 14 - 09/07/2026

### Integración OCR con Google Document AI

### Actividad realizada

Se integró el servicio de OCR mediante Google Document AI en el backend del proyecto.

### Avances técnicos

* Se instaló la dependencia `@google-cloud/documentai`.
* Se creó el archivo `backend/src/servicios/servicioOcr.js`.
* Se configuró el servicio para procesar documentos PDF e imágenes.
* Se agregaron variables de entorno para:
  * ID del proyecto Google Cloud.
  * Región del procesador.
  * ID del procesador Document AI.
  * Ruta del archivo de credenciales.
* Se configuró correctamente la región `us` del procesador.
* Se validó la conexión con el procesador OCR real de Google Document AI.
* Se corrigieron errores iniciales de configuración relacionados con:
  * Exportación/importación del servicio OCR.
  * Variables de entorno.
  * Región incorrecta del procesador.
  * ID de procesador.

### Resultado obtenido

El backend quedó conectado correctamente con Google Document AI y puede procesar documentos reales mediante OCR.

### Pendiente para la siguiente jornada

* Procesar automáticamente el currículum al cargarlo.
* Guardar el texto extraído en MySQL.
* Mostrar el resultado OCR en el detalle del postulante.


## AVANCE 15 - 09/07/2026

### Procesamiento automático del currículum

### Actividad realizada

Se modificó la lógica de carga documental para que el OCR se ejecute automáticamente solo cuando el documento cargado sea un currículum.

### Avances técnicos

* Se actualizó la ruta `POST /api/documentos/cargar`.
* Se definió que el documento tipo `CURRICULUM` sea procesado inmediatamente con OCR.
* Se estableció que los documentos como cédula, salud y previsional queden en estado `PENDIENTE`.
* Se guardó el texto extraído del currículum en la tabla `datos_ocr`.
* Se actualizó el estado del documento a `PROCESADO` cuando el OCR finaliza correctamente.
* Se actualizó el estado del documento a `ERROR` cuando ocurre un problema en el procesamiento.
* Se confirmó que el texto extraído queda visible en la base de datos.
* Se mostró el texto OCR del currículum en la vista de detalle del postulante.

### Justificación funcional

Se definió que el OCR del currículum se utilice como apoyo al proceso de selección inicial, permitiendo revisar experiencia, conocimientos y palabras clave del candidato.

Los documentos como cédula, certificado de salud y certificado previsional no se procesan inmediatamente para evitar consumo innecesario de OCR. Estos documentos se proyectan para ser procesados solo cuando el postulante sea seleccionado, ya que su uso principal será para el archivo final del trabajador.

### Resultado obtenido

El currículum se procesa automáticamente al ser cargado, el texto extraído se guarda en MySQL y el reclutador puede visualizarlo desde el detalle de la postulación.

### Pendiente para la siguiente jornada

* Crear filtro por palabras clave.
* Comparar descripción de oferta laboral con texto extraído del currículum.
* Mostrar porcentaje de coincidencia al reclutador.


## AVANCE 16 - 09/07/2026

### Preparación de filtro por coincidencia entre oferta y currículum

### Actividad realizada

Se dejó preparada la lógica para comparar el texto extraído del currículum con la descripción de la oferta laboral.

### Avances técnicos

* Se agregó función para normalizar texto.
* Se eliminaron tildes, símbolos y diferencias de mayúsculas/minúsculas para mejorar la comparación.
* Se generó una lista básica de palabras clave a partir del título y descripción de la oferta.
* Se compararon las palabras clave contra el texto OCR del currículum.
* Se calculó un porcentaje de coincidencia.
* Se identificaron palabras encontradas y palabras faltantes.
* Se preparó la respuesta del backend para mostrar esta información en el panel reclutador.

### Resultado esperado

El reclutador podrá ver una referencia inicial de compatibilidad entre el currículum y la oferta laboral, apoyando el proceso de revisión de postulantes.

### Pendiente para la siguiente jornada

* Mostrar visualmente el porcentaje de coincidencia en el panel reclutador.
* Permitir filtrar postulantes por palabras clave.
* Mejorar la lógica de comparación según los requisitos de cada oferta.


## AVANCE 17 - 09/07/2026

### Respaldo en GitHub

### Actividad realizada

Se realizó un commit completo del avance del proyecto, incluyendo la integración OCR y los cambios asociados al procesamiento del currículum.

### Avances técnicos

* Se revisó el estado del repositorio con `git status`.
* Se validó que no se subieran archivos sensibles.
* Se confirmó que el archivo `.env` no fuera incluido en el repositorio.
* Se confirmó que la carpeta de credenciales no fuera incluida en GitHub.
* Se confirmó que los documentos cargados por usuarios no fueran incluidos en el repositorio.
* Se agregó el avance completo mediante `git add .`.
* Se creó commit con la integración OCR.
* Se subieron los cambios al repositorio remoto en GitHub.

### Archivos y módulos relacionados

* Servicio OCR en backend.
* Ruta de carga documental.
* Ruta de panel reclutador.
* Vista de detalle del postulante.
* Visualización del texto extraído por OCR.
* Configuración de dependencias del backend.

### Resultado obtenido

El proyecto quedó respaldado en GitHub con el avance completo de la conexión OCR, sin exponer credenciales, variables de entorno ni documentos cargados.

### Pendiente general

* Completar filtro visual por coincidencia currículum/oferta.
* Procesar cédula, salud y previsional solo cuando el postulante sea seleccionado.
* Preparar generación de archivo final.
* Completar pruebas manuales del sistema.
* Preparar despliegue web.
* Actualizar documentación final del proyecto.