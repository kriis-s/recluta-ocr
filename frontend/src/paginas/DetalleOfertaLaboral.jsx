import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../estilos/DetalleOfertaLaboral.css';
import API_URL from '../config/api';

function DetalleOfertaLaboral() {
  const { idOferta } = useParams();

  const [oferta, setOferta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [postulando, setPostulando] = useState(false);
  const [mensajePostulacion, setMensajePostulacion] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');

  // Se vuelve a consultar la oferta cuando cambia el identificador de la URL.
  useEffect(function cargarDetalleOferta() {
    async function obtenerDetalleOferta() {
      try {
        setCargando(true);
        setMensaje('');
        setOferta(null);

        if (!idOferta || Number.isNaN(Number(idOferta))) {
          setMensaje('El identificador de la oferta no es válido.');
          return;
        }

        const respuesta = await fetch(
          `${API_URL}/api/ofertas/detalle/${idOferta}`
        );

        const datosRespuesta = await respuesta.json();

        if (!respuesta.ok) {
          setMensaje(
            datosRespuesta.mensaje ||
              'No fue posible cargar el detalle de la oferta.'
          );
          return;
        }

        setOferta(datosRespuesta.oferta);
      } catch (error) {
        console.error('Error al cargar el detalle de la oferta:', error);
        setMensaje('Error de conexión con el servidor.');
      } finally {
        setCargando(false);
      }
    }

    obtenerDetalleOferta();
  }, [idOferta]);

  async function manejarPostulacion() {
    try {
      setPostulando(true);
      setMensajePostulacion('');
      setTipoMensaje('');

      if (!idOferta || Number.isNaN(Number(idOferta))) {
        setMensajePostulacion('El identificador de la oferta no es válido.');
        setTipoMensaje('error');
        return;
      }

      const respuesta = await fetch(`${API_URL}/api/postulaciones/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id_oferta: Number(idOferta)
        })
      });

      const datosRespuesta = await respuesta.json();

      if (!respuesta.ok) {
        setMensajePostulacion(
          datosRespuesta.mensaje ||
            'No fue posible realizar la postulación.'
        );
        setTipoMensaje('error');
        return;
      }

      setMensajePostulacion('Postulación realizada correctamente.');
      setTipoMensaje('exito');
    } catch (error) {
      console.error('Error al realizar la postulación:', error);
      setMensajePostulacion('Error de conexión con el servidor.');
      setTipoMensaje('error');
    } finally {
      setPostulando(false);
    }
  }

  if (cargando) {
    return (
      <main className="pagina-detalle-oferta">
        <div className="contenedor">
          <div className="detalle-oferta-mensaje">
            Cargando información de la oferta...
          </div>
        </div>
      </main>
    );
  }

  if (mensaje || !oferta) {
    return (
      <main className="pagina-detalle-oferta">
        <div className="contenedor">
          <div className="detalle-oferta-mensaje error">
            {mensaje || 'La oferta laboral no existe.'}
          </div>

          <Link to="/ofertas" className="boton-volver">
            Volver a ofertas
          </Link>
        </div>
      </main>
    );
  }

  const jornada = oferta.tipo_jornada || oferta.jornada || 'No informada';
  const estadoOferta = oferta.estado || 'No informado';
  // El botón queda bloqueado si la oferta ya no se encuentra activa.
  const ofertaActiva = String(estadoOferta).toUpperCase() === 'ACTIVA';

  return (
    <main className="pagina-detalle-oferta">
      <div className="contenedor">
        <Link to="/ofertas" className="enlace-volver">
          ← Volver a ofertas laborales
        </Link>

        <article className="detalle-oferta-contenido">
          <header className="detalle-oferta-encabezado">
            <div>
              <span className="detalle-oferta-etiqueta">
                Oferta laboral
              </span>

              <h1>{oferta.titulo}</h1>

              <div className="detalle-oferta-datos">
                <span>{oferta.empresa || 'Empresa no informada'}</span>
                <span>{oferta.ubicacion || 'Ubicación no informada'}</span>
                <span>{jornada}</span>
              </div>
            </div>

            <span className="detalle-oferta-estado">
              {estadoOferta}
            </span>
          </header>

          <section className="detalle-oferta-seccion">
            <h2>Descripción del cargo</h2>
            <p>
              {oferta.descripcion ||
                'La oferta no registra descripción disponible.'}
            </p>
          </section>

          <section className="detalle-oferta-resumen">
            <div>
              <strong>Empresa</strong>
              <span>{oferta.empresa || 'No informada'}</span>
            </div>

            <div>
              <strong>Ubicación</strong>
              <span>{oferta.ubicacion || 'No informada'}</span>
            </div>

            <div>
              <strong>Jornada</strong>
              <span>{jornada}</span>
            </div>

            <div>
              <strong>Sueldo</strong>
              <span>
                {oferta.sueldo
                  ? `$${Number(oferta.sueldo).toLocaleString('es-CL')}`
                  : 'No informado'}
              </span>
            </div>

            <div>
              <strong>Estado</strong>
              <span>{estadoOferta}</span>
            </div>
          </section>

          {mensajePostulacion && (
            <div className={`detalle-oferta-alerta ${tipoMensaje}`}>
              {mensajePostulacion}
            </div>
          )}

          <div className="detalle-oferta-acciones">
            <button
              type="button"
              className="boton-principal"
              onClick={manejarPostulacion}
              disabled={postulando || !ofertaActiva}
            >
              {postulando ? 'Postulando...' : 'Postular a esta oferta'}
            </button>

            <Link to="/ofertas" className="boton-secundario">
              Volver al listado
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}

export default DetalleOfertaLaboral;
