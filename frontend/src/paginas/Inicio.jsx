import { Link } from "react-router-dom";
import "../estilos/Inicio.css";

function Inicio() {
  return (
    <main className="pagina-inicio">
      <section className="inicio-hero">
        <div className="contenedor inicio-hero-contenido">
          <div className="inicio-texto">
            <span className="inicio-etiqueta">
              Plataforma de Reclutamiento con OCR
            </span>

            <h1>Reclutamiento y gestión documental en una sola plataforma</h1>

            <p>
              Sistema web orientado a centralizar postulaciones, administrar
              ofertas laborales y apoyar la revisión de documentos mediante
              tecnología OCR.
            </p>

            <div className="inicio-acciones">
              <Link to="/registro" className="boton-principal">
                Registrarse
              </Link>

              <Link to="/iniciar-sesion" className="boton-secundario">
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Inicio;
