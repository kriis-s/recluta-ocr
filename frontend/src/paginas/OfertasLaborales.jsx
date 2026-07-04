import { useEffect, useState } from 'react';
import '../estilos/OfertasLaborales.css';

function OfertasLaborales() {
  const [busqueda, setBusqueda] = useState('');
  const [ofertas, setOfertas] = useState([]);
  const [cargandoOfertas, setCargandoOfertas] = useState(true);
  const [mensajeOfertas, setMensajeOfertas] = useState('');
  const [mensajePostulacion, setMensajePostulacion] = useState('');
  const [tipoMensajePostulacion, setTipoMensajePostulacion] = useState(''); // 'exito' o 'error'
  const [ofertaProcesando, setOfertaProcesando] = useState(null);

  useEffect(function cargarOfertasLaborales() {
    async function obtenerOfertasLaborales() {
      try {
        setCargandoOfertas(true);
        setMensajeOfertas('');

        const respuesta = await fetch('http://localhost:3001/api/ofertas/listar');
        const datosRespuesta = await respuesta.json();

        if (!respuesta.ok) {
          setMensajeOfertas(
            datosRespuesta.mensaje || 'No fue posible cargar las ofertas laborales.'
          );
          return;
        }

        setOfertas(datosRespuesta.ofertas || []);

      } catch (error) {
        console.error('Error al cargar ofertas laborales:', error);
        setMensajeOfertas('Error de conexión con el servidor.');

      } finally {
        setCargandoOfertas(false);
      }
    }

    obtenerOfertasLaborales();
  }, []);

  function manejarCambioBusqueda(evento) {
    setBusqueda(evento.target.value);
  }

  function coincideConBusqueda(oferta) {
    const textoBusqueda = busqueda.trim().toLowerCase();

    if (!textoBusqueda) {
      return true;
    }

    return (
      oferta.titulo.toLowerCase().includes(textoBusqueda) ||
      oferta.ubicacion.toLowerCase().includes(textoBusqueda) ||
      oferta.jornada.toLowerCase().includes(textoBusqueda)
    );
  }

  const ofertasFiltradas = ofertas.filter(coincideConBusqueda);

  async function manejarPostulacion(idOferta) {
  try {
    setOfertaProcesando(idOferta);
    setMensajePostulacion('');
    setTipoMensajePostulacion('');

    const respuesta = await fetch('http://localhost:3001/api/postulaciones/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        id_oferta: idOferta
      })
    });

    const datosRespuesta = await respuesta.json();

    if (!respuesta.ok) {
      setMensajePostulacion(
        datosRespuesta.mensaje || 'No fue posible realizar la postulación.'
      );
      setTipoMensajePostulacion('error');
      return;
    }

    setMensajePostulacion('Postulación realizada correctamente.');
    setTipoMensajePostulacion('exito');

  } catch (error) {
    console.error('Error al postular:', error);
    setMensajePostulacion('Error de conexión con el servidor.');
    setTipoMensajePostulacion('error');

  } finally {
    setOfertaProcesando(null);
  }
}

  return (
    <main className="pagina-ofertas">
      <div className="contenedor">
        <section className="ofertas-encabezado">
          <h1>Ofertas laborales disponibles</h1>
          <p>
            Revise las vacantes publicadas y seleccione una oferta para iniciar
            el proceso de postulación. Posteriormente, el sistema permitirá cargar
            documentos y procesarlos mediante OCR.
          </p>
        </section>

        <section className="ofertas-filtros">
          <label htmlFor="busqueda">Buscar oferta</label>
          <input
            type="text"
            id="busqueda"
            value={busqueda}
            onChange={manejarCambioBusqueda}
            placeholder="Buscar por cargo, comuna o jornada"
          />
        </section>

        <section className="ofertas-listado">
          {mensajePostulacion && (
            <div className={`ofertas-mensaje ${tipoMensajePostulacion}`}>
              {mensajePostulacion}
            </div>
          )}
          {cargandoOfertas ? (
            <div className="ofertas-vacio">Cargando ofertas laborales...</div>
          ) : mensajeOfertas ? (
            <div className="ofertas-vacio">{mensajeOfertas}</div>
          ) : ofertasFiltradas.length > 0 ? (
            ofertasFiltradas.map(function mostrarOferta(oferta) {
              return (
                <article className="oferta-tarjeta" key={oferta.id}>
                  <div className="oferta-superior">
                    <div>
                      <h2 className="oferta-titulo">{oferta.titulo}</h2>

                      <div className="oferta-detalles">
                        <span>{oferta.ubicacion}</span>
                        <span>{oferta.jornada}</span>
                        <span>{oferta.modalidad}</span>
                      </div>
                    </div>

                    <span className="oferta-estado">{oferta.estado}</span>
                  </div>

                  <p className="oferta-descripcion">{oferta.descripcion}</p>

                  <div className="oferta-acciones">
                    <button
                      type="button"
                      className="boton-principal"
                      onClick={() => manejarPostulacion(oferta.id)}
                      disabled={ofertaProcesando === oferta.id}
                    >
                      {ofertaProcesando === oferta.id ? 'Postulando...' : 'Postular'}
                    </button>

                    <button type="button" className="boton-secundario">
                      Ver detalle
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="ofertas-vacio">
              No se encontraron ofertas laborales con el criterio ingresado.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default OfertasLaborales;
