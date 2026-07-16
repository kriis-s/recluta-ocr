import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../estilos/PanelReclutador.css';
import API_URL from '../config/api';

function DetallePostulante() {
  const { id_postulacion } = useParams();

  const [postulacion, setPostulacion] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  const [estadosDisponibles, setEstadosDisponibles] = useState([]);
  const [idEstadoSeleccionado, setIdEstadoSeleccionado] = useState('');
  const [observacionEstado, setObservacionEstado] = useState('');
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [tipoMensajeEstado, setTipoMensajeEstado] = useState('');
  const [cargandoEstado, setCargandoEstado] = useState(false);

  // La bandera evita actualizar estados si se abandona la página durante la carga.
  useEffect(function cargarDetallePostulacion() {
    let componenteActivo = true;

    async function obtenerDetallePostulacion() {
      try {
        const respuesta = await fetch(
          `${API_URL}/api/reclutador/postulacion/${id_postulacion}`,
          {
            method: 'GET',
            credentials: 'include'
          }
        );

        const datosRespuesta = await respuesta.json();

        if (!componenteActivo) {
          return;
        }

        if (!respuesta.ok) {
          setMensaje(
            datosRespuesta.mensaje || 'No fue posible cargar el detalle de la postulación.'
          );
          return;
        }

        setPostulacion(datosRespuesta.postulacion);
        setDocumentos(datosRespuesta.documentos || []);
        setEstadosDisponibles(datosRespuesta.estados || []);

        const estadoActual = datosRespuesta.estados?.find(function buscarEstado(estado) {
          return estado.nombre_estado === datosRespuesta.postulacion.estado;
        });

        setIdEstadoSeleccionado(estadoActual ? estadoActual.id_estado : '');
        setObservacionEstado(datosRespuesta.postulacion.observacion || '');

      } catch (error) {
        console.error('Error al cargar detalle de postulación:', error);

        if (componenteActivo) {
          setMensaje('Error de conexión con el servidor.');
        }

      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    }

    obtenerDetallePostulacion();

    return function limpiarCarga() {
      componenteActivo = false;
    };
  }, [id_postulacion]);

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

  function formatearFecha(fecha) {
    if (!fecha) {
      return 'No registrada';
    }

    return new Date(fecha).toLocaleDateString('es-CL');
  }
  // Los textos obtenidos por OCR pueden ser extensos, por eso se acortan en la vista.
  function obtenerResumenTexto(texto) {
    if (!texto) {
      return '';
    }

    if (texto.length <= 800) {
      return texto;
    }

    return `${texto.substring(0, 800)}...`;
  }

  function obtenerClaseEstado(estado) {
    if (!estado) {
      return 'recibida';
    }

    return estado
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[á]/g, 'a')
      .replace(/[é]/g, 'e')
      .replace(/[í]/g, 'i')
      .replace(/[ó]/g, 'o')
      .replace(/[ú]/g, 'u');
  }

  function manejarCambioEstado(evento) {
    setIdEstadoSeleccionado(evento.target.value);
  }

  function manejarCambioObservacion(evento) {
    setObservacionEstado(evento.target.value);
  }

  function mostrarCoincidencia(valor) {
    if (Number(valor) === 1) {
      return 'Sí coincide';
    }

    return 'No confirmado';
  }

  // El cambio de estado y su observación se guardan juntos para mantener el historial.
  async function guardarCambioEstado() {
    if (!idEstadoSeleccionado) {
      setMensajeEstado('Debe seleccionar un estado.');
      setTipoMensajeEstado('error');
      return;
    }

    try {
      setCargandoEstado(true);
      setMensajeEstado('');
      setTipoMensajeEstado('');

      const respuesta = await fetch(
        `${API_URL}/api/reclutador/postulacion/${id_postulacion}/estado`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            id_estado: idEstadoSeleccionado,
            observacion: observacionEstado
          })
        }
      );

      const datosRespuesta = await respuesta.json();

      if (!respuesta.ok) {
        setMensajeEstado(
          datosRespuesta.mensaje || 'No fue posible cambiar el estado.'
        );
        setTipoMensajeEstado('error');
        return;
      }

      setPostulacion(function actualizarPostulacion(postulacionActual) {
        return {
          ...postulacionActual,
          estado: datosRespuesta.estado,
          observacion: observacionEstado
        };
      });

      if (datosRespuesta.procesamiento_final) {
        setMensajeEstado(
          `Estado actualizado correctamente. OCR final procesado: ${datosRespuesta.procesamiento_final.procesados} documento(s), errores: ${datosRespuesta.procesamiento_final.errores}.`
        );
      } else {
        setMensajeEstado('Estado actualizado correctamente.');
      }

      setTipoMensajeEstado('exito');

      if (datosRespuesta.estado === 'Seleccionado') {
        setTimeout(function recargarDetalle() {
          window.location.reload();
        }, 1200);
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      setMensajeEstado('Error de conexión con el servidor.');
      setTipoMensajeEstado('error');

    } finally {
      setCargandoEstado(false);
    }
  }

  if (cargando) {
    return (
      <main className="pagina-panel-reclutador">
        <div className="contenedor">
          <div className="reclutador-vacio">
            Cargando detalle de postulación...
          </div>
        </div>
      </main>
    );
  }

  if (mensaje) {
    return (
      <main className="pagina-panel-reclutador">
        <div className="contenedor">
          <div className="reclutador-vacio">
            {mensaje}
          </div>

          <Link to="/panel-reclutador" className="boton-principal">
            Volver al panel
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pagina-panel-reclutador">
      <div className="contenedor">
        <section className="panel-reclutador-encabezado">
          <h1>Detalle de postulación</h1>
          <p>
            Revisión de datos del postulante, oferta laboral asociada, documentos
            cargados y estado del procesamiento OCR.
          </p>

          <div className="panel-reclutador-acciones-principales">
            <Link to="/panel-reclutador" className="boton-secundario">
              Volver al panel
            </Link>
          </div>
        </section>

        <section className="panel-reclutador-grid">
          <div className="reclutador-tarjeta">
            <h2>Datos del postulante</h2>

            <div className="reclutador-listado">
              <article className="reclutador-postulante">
                <h3>
                  {postulacion.nombres} {postulacion.apellido_paterno} {postulacion.apellido_materno}
                </h3>

                <p>RUT: {postulacion.rut}</p>
                <p>Correo: {postulacion.correo}</p>
                <p>Teléfono: {postulacion.telefono || 'No registrado'}</p>
                <p>Dirección: {postulacion.direccion || 'No registrada'}</p>
                <p>Fecha de nacimiento: {formatearFecha(postulacion.fecha_nacimiento)}</p>

                <span className={`reclutador-estado ${obtenerClaseEstado(postulacion.estado)}`}>
                  {postulacion.estado}
                </span>
              </article>
            </div>
          </div>

          <div className="reclutador-tarjeta">
            <h2>Oferta asociada</h2>

            <div className="reclutador-listado">
              <article className="reclutador-oferta">
                <h3>{postulacion.oferta}</h3>
                <p>Área: {postulacion.area || 'No registrada'}</p>
                <p>Ubicación: {postulacion.ubicacion || 'No registrada'}</p>
                <p>Jornada: {postulacion.tipo_jornada || 'No registrada'}</p>
                <p>Fecha postulación: {formatearFecha(postulacion.fecha_postulacion)}</p>
                <p>Observación: {postulacion.observacion || 'Sin observación'}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="reclutador-tarjeta">
          <h2>Cambiar estado de postulación</h2>

          <div className="reclutador-listado">
            <article className="reclutador-postulante">
              {mensajeEstado && (
                <div className={`panel-mensaje ${tipoMensajeEstado}`}>
                  {mensajeEstado}
                </div>
              )}

              <div className="reclutador-filtros">
                <label htmlFor="estadoPostulacion">Estado</label>
                <select
                  id="estadoPostulacion"
                  value={idEstadoSeleccionado}
                  onChange={manejarCambioEstado}
                >
                  <option value="">Seleccione un estado</option>

                  {estadosDisponibles.map(function mostrarEstado(estado) {
                    return (
                      <option key={estado.id_estado} value={estado.id_estado}>
                        {estado.nombre_estado}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="reclutador-filtros">
                <label htmlFor="observacionEstado">Observación</label>
                <textarea
                  id="observacionEstado"
                  value={observacionEstado}
                  onChange={manejarCambioObservacion}
                  placeholder="Ingrese una observación para la postulación"
                  rows={4}
                />
              </div>

              <button
                type="button"
                className="boton-principal"
                onClick={guardarCambioEstado}
                disabled={cargandoEstado}
              >
                {cargandoEstado ? 'Guardando...' : 'Guardar cambio de estado'}
              </button>
            </article>
          </div>
        </section>

        <section className="reclutador-tarjeta">
          <h2>Documentos cargados</h2>

          <div className="reclutador-listado">
            {documentos.length > 0 ? (
              documentos.map(function mostrarDocumento(documento) {
                return (
                  <article className="reclutador-postulante" key={documento.id_documento}>
                    <h3>{formatearTipoDocumento(documento.tipo_documento)}</h3>

                    <p>Archivo: {documento.nombre_archivo}</p>
                    <p>Formato: {documento.formato || 'No registrado'}</p>
                    <p>Estado procesamiento: {documento.estado_procesamiento}</p>
                    <p>RUT detectado: {documento.rut_detectado || 'Pendiente OCR'}</p>
                    <p>Nombre detectado: {documento.nombre_detectado || 'Pendiente OCR'}</p>
                    <p>Institución detectada: {documento.institucion_detectada || 'Pendiente OCR'}</p>
                    <p>Tipo institución: {documento.tipo_institucion || 'Pendiente OCR'}</p>
                    <p>Fecha emisión detectada: {documento.fecha_emision_detectada || 'Pendiente OCR'}</p>
                    <p>Confianza OCR: {documento.confianza || 'Pendiente OCR'}</p>

                    {documento.id_ocr && (
                      <div className="reclutador-validacion-ocr">
                        <h4>Validación OCR</h4>
                        <p>Coincidencia RUT: {mostrarCoincidencia(documento.coincide_rut)}</p>
                        <p>Coincidencia nombre: {mostrarCoincidencia(documento.coincide_nombre)}</p>
                        <p>
                          Observación: {documento.observacion_validacion || 'Sin observación registrada.'}
                        </p>
                      </div>
                    )}

                    {documento.tipo_documento === 'CURRICULUM' && documento.texto_extraido && (
                      <div className="reclutador-texto-ocr">
                        <h4>Texto extraído del currículum</h4>
                        <p>{obtenerResumenTexto(documento.texto_extraido)}</p>
                      </div>
                    )}

                    <a href={`${API_URL}/api/reclutador/documento/${documento.id_documento}/ver`} target="_blank" rel="noreferrer" className="boton-principal">
                        Ver documento
                        </a>
                    </article>
                );
              })
            ) : (
              <div className="reclutador-vacio">
                El postulante aún no tiene documentos cargados.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default DetallePostulante;
