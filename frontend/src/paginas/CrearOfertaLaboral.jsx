import { useState } from "react";
import { Link } from "react-router-dom";
import "../estilos/CrearOfertaLaboral.css";
import API_URL from '../config/api';

const ofertaLaboralVacia = {
  titulo: "",
  area: "",
  ubicacion: "",
  jornada: "",
  modalidad: "",
  descripcion: "",
  requisitos: "",
  empresa: "",
  sueldo: "",
  estado: "Activa"
};

const jornadasDisponibles = [
  "Lunes a viernes",
  "Turno mañana",
  "Turno tarde",
  "Turno noche",
  "Turnos rotativos"
];

const modalidadesDisponibles = ["Presencial", "Hibrida", "Remota"];
const estadosDisponibles = ["Activa", "Inactiva"];

// Se adapta el formulario a los nombres de campos que espera la API.
function prepararOfertaLaboral(datosOferta) {
  const descripcionCompleta = `modalidad: ${datosOferta.modalidad}
  descripción: ${datosOferta.descripcion.trim()}
  requisitos: ${datosOferta.requisitos.trim() || "No se especifican requisitos"}`.trim();

  return {
    titulo: datosOferta.titulo.trim(),
    empresa: datosOferta.empresa.trim(),
    sueldo: Number(datosOferta.sueldo),
    area: datosOferta.area.trim(),
    ubicacion: datosOferta.ubicacion.trim(),
    tipo_jornada: datosOferta.jornada,
    descripcion: descripcionCompleta,
    estado: datosOferta.estado === "Activa" ? "ACTIVA" : "INACTIVA"
  };
}

function CrearOfertaLaboral() {
  const [datosOferta, setDatosOferta] = useState({ ...ofertaLaboralVacia });
  const [mensajeFormulario, setMensajeFormulario] = useState("");
  const [tipoMensajeFormulario, setTipoMensajeFormulario] = useState("");
  const [cargando, setCargando] = useState(false);

  function manejarCambioCampo(evento) {
    const nombreCampo = evento.target.name;
    const valorCampo = evento.target.value;

    setDatosOferta(function actualizarDatosOferta(datosActuales) {
      return {
        ...datosActuales,
        [nombreCampo]: valorCampo
      };
    });
  }

  function validarOfertaLaboral() {
    // Se eliminan espacios para evitar aceptar campos que parecen completos.
    const tituloOferta = datosOferta.titulo.trim();
    const empresaOferta = datosOferta.empresa.trim();
    const sueldoOferta = datosOferta.sueldo;
    const areaOferta = datosOferta.area.trim();
    const ubicacionOferta = datosOferta.ubicacion.trim();
    const descripcionOferta = datosOferta.descripcion.trim();

    if (!tituloOferta) {
      return "Debe ingresar el título de la oferta laboral.";
    }

    if (!empresaOferta) {
      return "Debe ingresar la empresa donde se trabajará.";
    }

    if (!sueldoOferta) {
      return "Debe ingresar el sueldo de la oferta laboral.";
    }

    if (Number(sueldoOferta) <= 0) {
      return "El sueldo debe ser mayor a cero.";
    }

    if (!areaOferta) {
      return "Debe ingresar el área de la oferta laboral.";
    }

    if (!ubicacionOferta) {
      return "Debe ingresar la ubicación de la oferta laboral.";
    }

    if (!datosOferta.jornada) {
      return "Debe seleccionar la jornada de trabajo.";
    }

    if (!datosOferta.modalidad) {
      return "Debe seleccionar la modalidad de trabajo.";
    }

    if (!descripcionOferta) {
      return "Debe ingresar la descripción de la oferta laboral.";
    }

    if (descripcionOferta.length < 20) {
      return "La descripción debe tener al menos 20 caracteres.";
    }

    return "";
  }

  function limpiarDatosFormulario() {
    setDatosOferta({ ...ofertaLaboralVacia });
  }

  async function manejarEnvioFormulario(evento) {
    evento.preventDefault();

    const mensajeError = validarOfertaLaboral();

    if (mensajeError) {
      setMensajeFormulario(mensajeError);
      setTipoMensajeFormulario("error");
      return;
    }

    try {
      setCargando(true);
      setMensajeFormulario("");
      setTipoMensajeFormulario("");
      const ofertaPreparada = prepararOfertaLaboral(datosOferta);

      const respuesta = await fetch(`${API_URL}/api/ofertas/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(ofertaPreparada)
      });

      const datosRespuesta = await respuesta.json();

      if (!respuesta.ok) {
        setMensajeFormulario(
          datosRespuesta.mensaje ||
            datosRespuesta.error ||
            "Error al crear la oferta laboral."
        );
        setTipoMensajeFormulario("error");
        setCargando(false);
        return;
      }

      setMensajeFormulario("Oferta laboral creada correctamente.");
      setTipoMensajeFormulario("exito");
      limpiarDatosFormulario();

    } catch (error) {
      console.error("Error al crear la oferta laboral:", error);

      setMensajeFormulario(
        "Error al crear la oferta laboral. Intente nuevamente."
      );
      setTipoMensajeFormulario("error");

    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="pagina-crear-oferta">
      <div className="crear-oferta-contenedor">
        <section className="crear-oferta-encabezado">
          <h1>Crear oferta laboral</h1>
          <p>
            Complete los datos necesarios para publicar una nueva vacante dentro
            de la plataforma de reclutamiento.
          </p>
        </section>

        <form className="crear-oferta-formulario" onSubmit={manejarEnvioFormulario}>
          {mensajeFormulario && (
            <div className={`crear-oferta-mensaje ${tipoMensajeFormulario}`}>
              {mensajeFormulario}
            </div>
          )}

          <div className="crear-oferta-grupo">
            <label htmlFor="titulo">Título de la oferta</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={datosOferta.titulo}
              onChange={manejarCambioCampo}
              placeholder="Ejemplo: Operario de bodega"
            />
          </div>

          <div className="crear-oferta-fila">
            <div className="crear-oferta-grupo">
              <label htmlFor="empresa">Empresa donde se trabajará</label>
              <input
                type="text"
                id="empresa"
                name="empresa"
                value={datosOferta.empresa}
                onChange={manejarCambioCampo}
                placeholder="Ejemplo: SAEP, empresa mandante o centro de trabajo"
              />
            </div>

            <div className="crear-oferta-grupo">
              <label htmlFor="sueldo">Sueldo</label>
              <input
                type="number"
                id="sueldo"
                name="sueldo"
                value={datosOferta.sueldo}
                onChange={manejarCambioCampo}
                placeholder="Ejemplo: 550000"
                min="0"
              />
            </div>
          </div>

          <div className="crear-oferta-fila">
            <div className="crear-oferta-grupo">
              <label htmlFor="area">Área</label>
              <input type="text" id="area" name="area" value={datosOferta.area} onChange={manejarCambioCampo} placeholder="Ejemplo: Logística"/>
            </div>
          </div>

          <div className="crear-oferta-fila">
            <div className="crear-oferta-grupo">
              <label htmlFor="ubicacion">Ubicación</label>
              <input type="text" id="ubicacion" name="ubicacion" value={datosOferta.ubicacion} onChange={manejarCambioCampo} placeholder="Ejemplo: Santiago"/>
            </div>

            <div className="crear-oferta-grupo">
              <label htmlFor="jornada">Jornada</label>
              <select id="jornada" name="jornada" value={datosOferta.jornada} onChange={manejarCambioCampo}>
                <option value="">Seleccione una opción</option>
                {jornadasDisponibles.map(function mostrarJornada(jornada) {
                  return (
                    <option key={jornada} value={jornada}>
                      {jornada}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="crear-oferta-fila">
            <div className="crear-oferta-grupo">
              <label htmlFor="modalidad">Modalidad</label>
              <select
                id="modalidad"
                name="modalidad"
                value={datosOferta.modalidad}
                onChange={manejarCambioCampo}
              >
                <option value="">Seleccione una opción</option>
                {modalidadesDisponibles.map(function mostrarModalidad(modalidad) {
                  return (
                    <option key={modalidad} value={modalidad}>
                      {modalidad}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="crear-oferta-grupo">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={datosOferta.estado}
                onChange={manejarCambioCampo}
              >
                <option value="">Seleccione una opción</option>
                {estadosDisponibles.map(function mostrarEstado(estadoOferta) {
                  return (
                    <option key={estadoOferta} value={estadoOferta}>
                      {estadoOferta}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="crear-oferta-grupo">
            <label htmlFor="descripcion">Descripción de la oferta</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={datosOferta.descripcion}
              onChange={manejarCambioCampo}
              placeholder="Describa las principales funciones del cargo"
              rows={5}
            />
          </div>

          <div className="crear-oferta-grupo">
            <label htmlFor="requisitos">Requisitos</label>
            <textarea
              id="requisitos"
              name="requisitos"
              value={datosOferta.requisitos}
              onChange={manejarCambioCampo}
              placeholder="Ingrese requisitos o antecedentes solicitados"
              rows={4}
            />
          </div>

          <div className="crear-oferta-acciones">
            <button type="submit" className="boton-principal" disabled={cargando}>  
              {cargando ? "Creando..." : "Crear oferta"}
            </button>

            <Link to="/panel-reclutador" className="boton-secundario">
              Volver al panel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CrearOfertaLaboral;
