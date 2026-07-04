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

  
  const documentos = [];

  useEffect(function cargarDatosPanel() {
    async function obtenerDatosPanel() {
      try {
        setCargandoPanel(true);
        setMensajePanel('');

        const respuesta = await fetch('http://localhost:3001/api/postulaciones/mis-postulaciones', {
          method: 'GET',
          credentials: 'include'
        });

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
        console.error('Error al cargar los datos del panel:', error);
        setMensajePanel('Error de conexión con el servidor.');
      } finally {
        setCargandoPanel(false);
      }
    }

    obtenerDatosPanel();
  }, []);

  function obtenerClaseEstado(estado) {
    if (!estado) { return '';}

    return estado.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
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
  function manejarEnvioDocumento(evento) {
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

    // Esta validación queda en el frontend para evitar envíos innecesarios al backend.
    setMensaje(
      'Documento validado correctamente. Próximo paso: envío al backend y procesamiento OCR.'
    );
    setTipoMensaje('exito');
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
                    <option value="cedula">Cédula de identidad</option>
                    <option value="afp">Certificado AFP</option>
                    <option value="salud">Certificado de salud</option>
                    <option value="cv">Currículum vitae</option>
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
                {documentos.length === 0 && (
                  <p>Aún no tienes documentos cargados.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default PanelPostulante;