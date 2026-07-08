import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../estilos/PanelReclutador.css';

function PanelReclutador() {
  const [busqueda, setBusqueda] = useState('');
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState();
  const [ofertas, setOfertas] = useState([]);
  const [postulantes, setPostulantes] = useState([]);
  const [resumen, setResumen] = useState({ofertas_activas: 0, total_postulantes: 0, documentos_cargados: 0, documentos_procesados: 0 });
  const [cargandoPanel, setCargandoPanel] = useState(true);
  const [mensajePanel, setMensajePanel] = useState('');
  

  function manejarCambioBusqueda(evento) {
    setBusqueda(evento.target.value);
  }
  function manejarSeleccionOferta(idOferta) {
  setOfertaSeleccionada(idOferta);
  setBusqueda('');
  }

  function limpiarFiltroOferta() {
    setOfertaSeleccionada('');
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

  function obtenerEstadoOcr(postulante) {
    if (Number(postulante.cantidad_documentos) === 0) {
      return 'Sin documentos cargados';
    }

    if (Number(postulante.documentos_procesados) === Number(postulante.cantidad_documentos)) {
      return 'Documentos procesados';
    }

    return 'Pendiente OCR';
  }

  function coincideConFiltro(postulante) {
    const textoBusqueda = busqueda.trim().toLowerCase();

    if (!textoBusqueda) {
      return true;
    }

    return (
      postulante.nombre.toLowerCase().includes(textoBusqueda) ||
      postulante.rut.toLowerCase().includes(textoBusqueda) ||
      postulante.oferta.toLowerCase().includes(textoBusqueda) ||
      postulante.estado.toLowerCase().includes(textoBusqueda)
    );
  }

  const postulantesFiltrados = postulantes.filter(function filtrarPostulantes(postulante) {
    const coincideOferta =
      !ofertaSeleccionada ||
      Number(postulante.id_oferta) === Number(ofertaSeleccionada);

    return coincideOferta && coincideConFiltro(postulante);
  });

  useEffect(function cargarPanelReclutador() {
  let componenteActivo = true;

  async function obtenerPanelReclutador() {
      try {
        const respuesta = await fetch(
          'http://localhost:3001/api/reclutador/panel',
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
          setMensajePanel(
            datosRespuesta.mensaje || 'No fue posible cargar el panel del reclutador.'
          );
          return;
        }

        setResumen(datosRespuesta.resumen || {});
        setOfertas(datosRespuesta.ofertas || []);
        setPostulantes(datosRespuesta.postulantes || []);

      } catch (error) {
        console.error('Error al cargar panel reclutador:', error);

        if (componenteActivo) {
          setMensajePanel('Error de conexión con el servidor.');
        }

      } finally {
        if (componenteActivo) {
          setCargandoPanel(false);
        }
      }
    }

    obtenerPanelReclutador();

    return function limpiarCarga() {
      componenteActivo = false;
    };
  }, []);

  return (
    <main className="pagina-panel-reclutador">
      <div className="contenedor">
        <section className="panel-reclutador-encabezado">
          <h1>Panel del reclutador</h1>
          <p>
            En esta sección el reclutador podrá revisar ofertas laborales,
            consultar postulantes, verificar documentos cargados y revisar los
            resultados obtenidos mediante OCR.
          </p>

          <div className="panel-reclutador-acciones-principales">
            <Link to="/crear-oferta" className="boton-principal">
              Crear nueva oferta
            </Link>
          </div>
        </section>
        {cargandoPanel && (
          <div className="reclutador-vacio">
            Cargando información del panel...
          </div>
        )}

        {!cargandoPanel && mensajePanel && (
          <div className="reclutador-vacio">
            {mensajePanel}
          </div>
        )}
        {!cargandoPanel && !mensajePanel && (
        <>
        <section className="panel-reclutador-resumen">
          <article className="reclutador-indicador">
            <span>Ofertas activas</span>
            <strong>{resumen.ofertas_activas || 0}</strong>
          </article>

          <article className="reclutador-indicador">
            <span>Postulantes</span>
            <strong>{resumen.total_postulantes || 0}</strong>
          </article>

          <article className="reclutador-indicador">
            <span>Documentos cargados</span>
            <strong>{resumen.documentos_cargados || 0}</strong>
          </article>

          <article className="reclutador-indicador">
            <span>Procesados OCR</span>
            <strong>{resumen.documentos_procesados || 0}</strong>
          </article>
        </section>
        
        <section className="panel-reclutador-grid">
          <div className="reclutador-tarjeta">
            <h2>Ofertas laborales</h2>

            <div className="reclutador-listado">
              {ofertas.map(function mostrarOferta(oferta) {
                return (
                  <article className="reclutador-oferta" key={oferta.id_oferta}>
                    <h3>{oferta.titulo}</h3>
                    <p>Ubicación: {oferta.ubicacion}</p>
                    <p>Postulantes asociados: {oferta.postulantes}</p>

                    <span className={`reclutador-estado ${obtenerClaseEstado(oferta.estado)}`}>
                      {oferta.estado}
                    </span>

                    <div className="reclutador-acciones">
                      <button type="button" className="reclutador-boton-secundario" onClick={() => manejarSeleccionOferta(oferta.id_oferta)}>
                        Ver postulantes
                      </button>

                      <button type="button" className="reclutador-boton-secundario">
                        Editar oferta
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="reclutador-tarjeta">
            <h2>Postulantes recientes</h2>

            <div className="reclutador-filtros">
              <label htmlFor="busquedaPostulante">Buscar postulante</label>
              <input type="text" id="busquedaPostulante" value={busqueda} onChange={manejarCambioBusqueda} placeholder="Buscar por nombre, RUT, oferta o estado"/>
            </div>
              {ofertaSeleccionada && (
                <div className="reclutador-filtro-activo">
                  <span>Mostrando postulantes de una oferta seleccionada.</span>

                  <button
                    type="button"
                    className="reclutador-boton-secundario"
                    onClick={limpiarFiltroOferta}
                  >
                    Ver todos
                  </button>
                </div>
              )}

            <div className="reclutador-listado">
              {postulantesFiltrados.length > 0 ? (
                postulantesFiltrados.map(function mostrarPostulante(postulante) {
                  return (
                    <article className="reclutador-postulante" key={postulante.id_postulacion}>
                      <h3>{postulante.nombre}</h3>
                      <p>RUT: {postulante.rut}</p>
                      <p>Oferta: {postulante.oferta}</p>
                      <p>{postulante.cantidad_documentos || 0} documentos cargados</p>
                      <p>Estado OCR: {obtenerEstadoOcr(postulante)}</p>

                      <span className={`reclutador-estado ${obtenerClaseEstado(postulante.estado)}`}>
                        {postulante.estado}
                      </span>

                      <div className="reclutador-acciones">
                        <Link to={`/reclutador/postulacion/${postulante.id_postulacion}`} className="boton-principal">
                          Revisar
                        </Link>

                        <button type="button" className="reclutador-boton-secundario">
                          Cambiar estado
                        </button>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="reclutador-vacio">
                  No se encontraron postulantes con el criterio ingresado.
                </div>
              )}
            </div>
          </div>
        </section>
      </>
      )}
      </div>
    </main>
  );
}

export default PanelReclutador;
