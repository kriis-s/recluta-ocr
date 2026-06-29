import { useState } from 'react';
import '../estilos/PanelPostulante.css';

function PanelPostulante() {
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');

  const postulante = {
    nombre: 'Juan Pérez',
    rut: '12345678-9',
    correo: 'juan@test.cl',
    telefono: '912345678',
    comuna: 'Santiago'
  };

  const postulaciones = [
    {
      id: 1,
      cargo: 'Operario de bodega',
      fecha: '26/06/2026',
      estado: 'En revisión',
      claseEstado: 'en-revision'
    },
    {
      id: 2,
      cargo: 'Asistente administrativo',
      fecha: '24/06/2026',
      estado: 'Recibida',
      claseEstado: 'recibida'
    }
  ];

  const documentos = [
    {
      id: 1,
      tipo: 'Cédula de identidad',
      archivo: 'cedula_juan.pdf',
      estado: 'Procesado'
    },
    {
      id: 2,
      tipo: 'Currículum vitae',
      archivo: 'cv_juan.pdf',
      estado: 'Cargado'
    }
  ];

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
                <strong>{postulante.nombre}</strong>
              </div>

              <div className="panel-dato">
                <span>RUT</span>
                <strong>{postulante.rut}</strong>
              </div>

              <div className="panel-dato">
                <span>Correo</span>
                <strong>{postulante.correo}</strong>
              </div>

              <div className="panel-dato">
                <span>Teléfono</span>
                <strong>{postulante.telefono}</strong>
              </div>

              <div className="panel-dato">
                <span>Comuna</span>
                <strong>{postulante.comuna}</strong>
              </div>
            </div>
          </aside>

          <section>
            <div className="panel-tarjeta panel-seccion">
              <h2>Mis postulaciones</h2>

              <div className="panel-listado">
                {postulaciones.map(function mostrarPostulacion(postulacion) {
                  return (
                    <article className="panel-postulacion" key={postulacion.id}>
                      <div className="panel-postulacion-superior">
                        <div>
                          <h3>{postulacion.cargo}</h3>
                          <p>Fecha de postulación: {postulacion.fecha}</p>
                        </div>

                        <span className={`panel-estado ${postulacion.claseEstado}`}>
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
                {documentos.map(function mostrarDocumento(documento) {
                  return (
                    <div className="panel-documento" key={documento.id}>
                      <div>
                        <strong>{documento.tipo}</strong>
                        <span>{documento.archivo}</span>
                      </div>

                      <span>{documento.estado}</span>
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
