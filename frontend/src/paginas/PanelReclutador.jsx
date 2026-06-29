import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../estilos/PanelReclutador.css';

function PanelReclutador() {
  const [busqueda, setBusqueda] = useState('');

  const ofertas = [
    {
      id: 1,
      titulo: 'Operario de bodega',
      ubicacion: 'Santiago',
      postulantes: 18,
      estado: 'Activa'
    },
    {
      id: 2,
      titulo: 'Asistente administrativo',
      ubicacion: 'Recoleta',
      postulantes: 9,
      estado: 'Activa'
    },
    {
      id: 3,
      titulo: 'Ayudante de producción',
      ubicacion: 'Quilicura',
      postulantes: 14,
      estado: 'Activa'
    }
  ];

  const postulantes = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      rut: '12345678-9',
      oferta: 'Operario de bodega',
      documentos: '3 documentos cargados',
      ocr: 'Cédula procesada',
      estado: 'En revisión',
      claseEstado: 'en-revision'
    },
    {
      id: 2,
      nombre: 'María González',
      rut: '11222333-4',
      oferta: 'Asistente administrativo',
      documentos: '2 documentos cargados',
      ocr: 'Pendiente OCR',
      estado: 'En revisión',
      claseEstado: 'en-revision'
    },
    {
      id: 3,
      nombre: 'Carlos Muñoz',
      rut: '99888777-6',
      oferta: 'Ayudante de producción',
      documentos: '4 documentos cargados',
      ocr: 'Documentos procesados',
      estado: 'Seleccionado',
      claseEstado: 'seleccionado'
    }
  ];

  function manejarCambioBusqueda(evento) {
    setBusqueda(evento.target.value);
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

  const postulantesFiltrados = postulantes.filter(coincideConFiltro);

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

        <section className="panel-reclutador-resumen">
          <article className="reclutador-indicador">
            <span>Ofertas activas</span>
            <strong>3</strong>
          </article>

          <article className="reclutador-indicador">
            <span>Postulantes</span>
            <strong>41</strong>
          </article>

          <article className="reclutador-indicador">
            <span>Documentos cargados</span>
            <strong>96</strong>
          </article>

          <article className="reclutador-indicador">
            <span>Procesados OCR</span>
            <strong>68</strong>
          </article>
        </section>

        <section className="panel-reclutador-grid">
          <div className="reclutador-tarjeta">
            <h2>Ofertas laborales</h2>

            <div className="reclutador-listado">
              {ofertas.map(function mostrarOferta(oferta) {
                return (
                  <article className="reclutador-oferta" key={oferta.id}>
                    <h3>{oferta.titulo}</h3>
                    <p>Ubicación: {oferta.ubicacion}</p>
                    <p>Postulantes asociados: {oferta.postulantes}</p>

                    <span className="reclutador-estado activa">
                      {oferta.estado}
                    </span>

                    <div className="reclutador-acciones">
                      <button type="button" className="reclutador-boton-secundario">
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
              <input
                type="text"
                id="busquedaPostulante"
                value={busqueda}
                onChange={manejarCambioBusqueda}
                placeholder="Buscar por nombre, RUT, oferta o estado"
              />
            </div>

            <div className="reclutador-listado">
              {postulantesFiltrados.length > 0 ? (
                postulantesFiltrados.map(function mostrarPostulante(postulante) {
                  return (
                    <article className="reclutador-postulante" key={postulante.id}>
                      <h3>{postulante.nombre}</h3>
                      <p>RUT: {postulante.rut}</p>
                      <p>Oferta: {postulante.oferta}</p>
                      <p>{postulante.documentos}</p>
                      <p>Estado OCR: {postulante.ocr}</p>

                      <span className={`reclutador-estado ${postulante.claseEstado}`}>
                        {postulante.estado}
                      </span>

                      <div className="reclutador-acciones">
                        <button type="button" className="boton-principal">
                          Revisar
                        </button>

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
      </div>
    </main>
  );
}

export default PanelReclutador;
