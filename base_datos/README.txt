PLATAFORMA WEB PARA RECLUTAMIENTO Y GESTIÓN DOCUMENTAL MEDIANTE OCR
ENTREGA DE BASE DE DATOS MYSQL

Estudiante:
Cristian Hormazabal Sobarzo

Proyecto:
Plataforma web para reclutamiento y gestión documental mediante OCR

Motor de base de datos:
MySQL 8

Nombre de la base de datos:
reclutamiento_ocr

Entorno utilizado:
La base de datos fue desarrollada en MySQL y se encuentra alojada en Google Cloud SQL.
La aplicación utiliza React en el frontend, Node.js y Express en el backend, y Google
Document AI para el procesamiento OCR de documentos.

1. CONTENIDO DE LA ENTREGA

01_creacion_base_datos.sql
Contiene la creación del esquema reclutamiento_ocr, las tablas, claves primarias,
claves foráneas, índices, restricciones y relaciones del modelo.

02_datos_prueba.sql
Contiene datos ficticios utilizados para demostrar el funcionamiento del sistema,
incluyendo usuarios de prueba, postulantes, reclutador, ofertas laborales,
postulaciones, documentos y resultados obtenidos mediante OCR.

03_modelo_entidad_relacion.pdf
Contiene el modelo entidad-relación generado desde MySQL Workbench.

README.txt
Contiene la descripción de la base de datos y las instrucciones de instalación.

2. ESTRUCTURA DE LA BASE DE DATOS

La base de datos está compuesta por ocho tablas:

usuarios
Almacena las credenciales de acceso, el rol y la fecha de registro de cada usuario.

postulantes
Almacena los datos personales de los candidatos y se relaciona uno a uno con usuarios.

reclutadores
Almacena la información del usuario encargado de gestionar ofertas y postulaciones.

ofertas_laborales
Almacena las vacantes creadas por los reclutadores.

estados_postulacion
Define los estados utilizados para controlar el avance de cada postulación.

postulaciones
Relaciona a los postulantes con las ofertas laborales y sus respectivos estados.

documentos
Almacena los antecedentes cargados por los postulantes y su estado de procesamiento.

datos_ocr
Almacena el texto y los datos extraídos mediante Google Document AI.

3. RELACIONES PRINCIPALES

usuarios 1:1 postulantes
usuarios 1:1 reclutadores
reclutadores 1:N ofertas_laborales
postulantes 1:N postulaciones
ofertas_laborales 1:N postulaciones
estados_postulacion 1:N postulaciones
postulantes 1:N documentos
postulaciones 1:N documentos
documentos 1:0..1 datos_ocr

4. INSTRUCCIONES DE INSTALACIÓN

Requisitos:
- MySQL Server 8 o versión compatible.
- MySQL Workbench u otro cliente compatible con MySQL.

Procedimiento:

1. Abrir MySQL Workbench.
2. Conectarse al servidor MySQL de destino.
3. Ejecutar primero el archivo 01_creacion_base_datos.sql.
4. Ejecutar después el archivo 02_datos_prueba.sql.
5. Verificar la creación del esquema y las tablas mediante:

USE reclutamiento_ocr;
SHOW TABLES;

6. Verificar la carga de datos mediante:

SELECT COUNT(*) FROM usuarios;
SELECT COUNT(*) FROM postulantes;
SELECT COUNT(*) FROM ofertas_laborales;
SELECT COUNT(*) FROM postulaciones;
SELECT COUNT(*) FROM documentos;
SELECT COUNT(*) FROM datos_ocr;

5. CONSIDERACIONES IMPORTANTES

- Todos los registros incluidos corresponden a datos ficticios de prueba.
- No se incluyen datos personales reales.
- No se incluyen contraseñas de Google Cloud, credenciales de MySQL, tokens,
  claves privadas, archivos .env ni cuentas de servicio.
- Las contraseñas de los usuarios se encuentran almacenadas mediante hash bcrypt.
- El script de datos restaura los registros y resultados OCR almacenados en MySQL,
  pero no copia físicamente los archivos PDF cargados en el servidor.
- La base de datos fue diseñada bajo un modelo relacional y normalizada hasta
  Tercera Forma Normal.
- Las claves primarias, claves foráneas y restricciones de unicidad permiten
  mantener la integridad referencial y evitar registros duplicados o inconexos.

6. DATOS DE PRUEBA

Cuenta reclutador:
Correo: reclutador@test.cl

Cuentas postulantes:
postulante1@test.cl
postulante2@test.cl
postulante3@test.cl
postulante4@test.cl
postulante5@test.cl
correo1@prueba.cl

Las contraseñas se mantienen cifradas en la base de datos. Las credenciales completas
de acceso a la demostración son entregadas por el medio definido de la evaluación.

7. SEGURIDAD

La aplicación utiliza contraseñas cifradas mediante bcrypt, autenticación mediante JWT
y control de acceso según rol. Los datos sensibles de infraestructura se gestionan
mediante variables de entorno y no forman parte de esta entrega.
