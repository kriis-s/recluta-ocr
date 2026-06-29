import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../estilos/OfertasLaborales.css';

function OfertasLaborales() {
  const [busqueda, setBusqueda] = useState('');

  const ofertas = [
    {
      id: 1,
      titulo: 'Operario de bodega',
      ubicacion: 'Santiago',
      jornada: 'Turno mañana',
      modalidad: 'Presencial',
      estado: 'Activa',
      descripcion:
        'Se requiere postulante para apoyar labores operativas de bodega, orden documental y preparación de antecedentes para proceso de contratación.'
    },
    {
      id: 2,
      titulo: 'Asistente administrativo',
      ubicacion: 'Recoleta',
      jornada: 'Lunes a viernes',
      modalidad: 'Presencial',
      estado: 'Activa',
      descripcion:
        'Cargo orientado a apoyar tareas administrativas, revisión de documentos y gestión de información asociada a procesos internos.'
    },
    {
      id: 3,
      titulo: 'Ayudante de producción',
      ubicacion: 'Quilicura',
      jornada: 'Turnos rotativos',
      modalidad: 'Presencial',
      estado: 'Activa',
      descripcion:
        'Vacante disponible para postulantes con disponibilidad para turnos y carga documental previa mediante plataforma web.'
    }
  ];

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
          {ofertasFiltradas.length > 0 ? (
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
                    <Link to="/registro" className="boton-principal">
                      Postular
                    </Link>

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
