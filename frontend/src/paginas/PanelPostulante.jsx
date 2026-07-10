import { useEffect, useState } from 'react';
import '../estilos/PanelPostulante.css';

function PanelPostulante() {
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [postulante, setPostulante] = useState(null);
  const [postulaciones, setPostulaciones] = useState([]);
  const [cargandoPanel, setCargandoPanel] = useState(true);
  const [mensajePanel, setMensajePanel] = useState('');

  
  const [documentos, setDocumentos] = useState([]);
  const [cargandoDocumentos, setCargandoDocumentos] = useState(true);
  const [mensajeDocumentos, setMensajeDocumentos] = useState('');

  async function cargarDocumentosPostulante(mostrarCarga = false) {
    try {
      if (mostrarCarga) {
        setCargandoDocumentos(true);
        setMensajeDocumentos('');
      }

      const respuesta = await fetch(
        'http://localhost:3001/api/documentos/mis-documentos',
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      const datosRespuesta = await respuesta.json();

      if (!respuesta.ok) {
        setMensajeDocumentos(
          datosRespuesta.mensaje || 'No fue posible cargar los documentos.'
        );
        return;
      }

      setDocumentos(datosRespuesta.documentos || []);

    } catch (error) {
      console.error('Error al cargar documentos:', error);
      setMensajeDocumentos('Error de conexión con el servidor.');

    } finally {
      setCargandoDocumentos(false);
    }
  }

  useEffect(function cargarDatosPanel() {
  async function obtenerDatosPanel() {
    try {
      setCargandoPanel(true);
      setMensajePanel('');

      const respuesta = await fetch(
        'http://localhost:3001/api/postulaciones/mis-postulaciones',
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      const datosRespuesta = await respuesta.json();

      if (!respuesta.ok) {
        setMensajePanel(
          datosRespuesta.mensaje || 'No fue posible cargar los datos del panel.'
        );
        return;
      }

      setPostulante(datosRespuesta.postulante);
      setPostulaciones(datosRespuesta.postulaciones || []);

    } catch (error) {
      console.error('Error al cargar panel postulante:', error);
      setMensajePanel('Error de conexión con el servidor.');

    } finally {
      setCargandoPanel(false);
    }
  }

  async function obtenerDocumentosIniciales() {
    try {
      const respuesta = await fetch(
        'http://localhost:3001/api/documentos/mis-documentos',
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      const datosRespuesta = await respuesta.json();

      if (!respuesta.ok) {
        setMensajeDocumentos(
          datosRespuesta.mensaje || 'No fue posible cargar los documentos.'
        );
        return;
      }

      setDocumentos(datosRespuesta.documentos || []);

    } catch (error) {
      console.error('Error al cargar documentos:', error);
      setMensajeDocumentos('Error de conexión con el servidor.');

    } finally {
      setCargandoDocumentos(false);
    }
  }

  obtenerDatosPanel();
  obtenerDocumentosIniciales();
}, []);

  function obtenerClaseEstado(estado) {
    if (!estado) { return '';}

    return estado.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
  }

  function formatearTipoDocumento(tipoDocumento) {
    const tipos = {
      CEDULA: 'Cédula de identidad',
      CURRICULUM: 'Currículum vitae',
      CERTIFICADO_SALUD: 'Certificado de salud',
      CERTIFICADO_PREVISIONAL: 'Certificado previsional',
      OTRO: 'Otro documento'
    };

    return tipos[tipoDocumento] || tipoDocumento;
  }

  function manejarCambioTipoDocumento(evento) {
    setTipoDocumento(evento.target.value);
  }
  function manejarArchivo(evento) {
    const archivoSeleccionado = evento.target.files[0];

    if (!archivoSeleccionado) {
      setArchivo(null);
      return;
    }
    
    setArchivo(archivoSeleccionado);
  }
  async function manejarEnvioDocumento(evento) {
    evento.preventDefault();


    if (!tipoDocumento) {
      setMensaje('Debe seleccionar el tipo de documento.');
      setTipoMensaje('error');
      return;
    }

    if (!archivo) {
      setMensaje('Debe seleccionar un archivo PDF o imagen.');
      setTipoMensaje('error');
      return;
    }

    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png'];

    if (!tiposPermitidos.includes(archivo.type)) {
      setMensaje('El archivo debe estar en formato PDF, JPG o PNG.');
      setTipoMensaje('error');
      return;
    }

    try {
      setMensaje('');
      setTipoMensaje('');

      const datosFormulario = new FormData();
      datosFormulario.append('tipo_documento', tipoDocumento);
      datosFormulario.append('archivo', archivo);

      const respuesta = await fetch('http://localhost:3001/api/documentos/cargar', {
        method: 'POST',
        credentials: 'include',
        body: datosFormulario
      });

      const datosRespuesta = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datosRespuesta.mensaje || 'No fue posible cargar el documento.');
        setTipoMensaje('error');
        return;
      }

      setMensaje('Documento cargado correctamente.');
      setTipoMensaje('exito');

      await cargarDocumentosPostulante(true);

      setTipoDocumento('');
      setArchivo(null);
      evento.target.reset();

    } catch (error) {
      console.error('Error al cargar documento:', error);
      setMensaje('Error de conexión con el servidor.');
      setTipoMensaje('error');
    }
  }

  return (
    <main className="pagina-panel-postulante">
      <div className="contenedor">
        <section className="panel-postulante-encabezado">
          <h1>Panel del postulante</h1>
          <p>
            En esta sección el postulante podrá revisar sus datos, consultar sus
            postulaciones y cargar documentos solicitados durante el proceso de
            selección.
          </p>
        </section>

        <div className="panel-postulante-grid">
          <aside className="panel-tarjeta">
            <h2>Datos personales</h2>

            <div className="panel-datos">
              <div className="panel-dato">
                <span>Nombre</span>
                <strong>
                  {postulante ? `${postulante.nombres} ${postulante.apellido_paterno} ${postulante.apellido_materno || ''}`
                   : 'cargando...'}
                </strong>
              </div>

              <div className="panel-dato">
                <span>RUT</span>
                <strong>{postulante?.rut || 'cargando...'}</strong>
              </div>

              <div className="panel-dato">
                <span>Correo</span>
                <strong>{postulante?.correo || 'cargando...'}</strong>
              </div>

              <div className="panel-dato">
                <span>Teléfono</span>
                <strong>{postulante?.telefono || 'cargando...'}</strong>
              </div>

              <div className="panel-dato">
                <span>Dirección</span>
                <strong>{postulante?.direccion || 'cargando...'}</strong>
              </div>
            </div>
          </aside>

          <section>
            <div className="panel-tarjeta panel-seccion">
              <h2>Mis postulaciones</h2>

              <div className="panel-listado">
                {cargandoPanel && (
                  <p>cargando postulaciones...</p>
                )}
                {!cargandoPanel && mensajePanel && (
                  <div className="panel-mensaje error">{mensajePanel}</div>
                )}

                {!cargandoPanel && !mensajePanel && postulaciones.map(function mostrarPostulacion(postulacion) {
                  return (
                    <article className="panel-postulacion" key={postulacion.id_postulacion}>
                      <div className="panel-postulacion-superior">
                        <div>
                          <h3>{postulacion.cargo}</h3>
                          <p>Fecha de postulación: {postulacion.fecha}</p>
                        </div>

                        <span className={`panel-estado ${obtenerClaseEstado(postulacion.estado)}`}>
                          {postulacion.estado}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="panel-tarjeta panel-seccion">
              <h2>Cargar documento</h2>

              <form className="panel-formulario-documento" onSubmit={manejarEnvioDocumento}>
                {mensaje && (
                  <div className={`panel-mensaje ${tipoMensaje}`}>
                    {mensaje}
                  </div>
                )}
                
                <div className="panel-grupo">
                  <label htmlFor="tipoDocumento">Tipo de documento</label>
                  <select
                    id="tipoDocumento"
                    value={tipoDocumento}
                    onChange={manejarCambioTipoDocumento}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="CEDULA">Cédula de identidad</option>
                    <option value="CURRICULUM">Currículum vitae</option>
                    <option value="CERTIFICADO_SALUD">Certificado de salud</option>
                    <option value="CERTIFICADO_PREVISIONAL">Certificado AFP</option>
                    <option value="OTRO">Otro documento</option>
                  </select>
                </div>

                <div className="panel-grupo">
                  <label htmlFor="archivo">Archivo PDF o imagen</label>
                  <input
                    type="file"
                    id="archivo"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={manejarArchivo}
                  />
                </div>

                <button type="submit" className="boton-principal">
                  Cargar documento
                </button>
              </form>
            </div>

            <div className="panel-tarjeta">
              <h2>Documentos cargados</h2>

              <div className="panel-documentos">
                {cargandoDocumentos && (
                  <p>Cargando documentos...</p>
                )}

                {!cargandoDocumentos && mensajeDocumentos && (
                  <div className="panel-mensaje error">
                    {mensajeDocumentos}
                  </div>
                )}

                {!cargandoDocumentos && !mensajeDocumentos && documentos.length === 0 && (
                  <p>Aún no tienes documentos cargados.</p>
                )}

                {!cargandoDocumentos && !mensajeDocumentos && documentos.map(function mostrarDocumento(documento) {
                  return (
                    <div className="panel-documento" key={documento.id_documento}>
                      <div>
                        <strong>{formatearTipoDocumento(documento.tipo_documento)}</strong>
                        <span>{documento.nombre_archivo}</span>
                        <span>Fecha de carga: {documento.fecha_carga}</span>
                      </div>

                      <span>{documento.estado_procesamiento}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default PanelPostulante;