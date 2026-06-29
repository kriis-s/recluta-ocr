import { NavLink } from 'react-router-dom';
import '../estilos/Menu.css';

function Menu() {
  return (
    <header className="menu">
      <div className="menu-contenedor">
        <NavLink to="/" className="menu-logo">
          Plataforma OCR
        </NavLink>

        <nav className="menu-navegacion">
          <NavLink to="/" className="menu-enlace">
            Inicio
          </NavLink>

          <NavLink to="/ofertas" className="menu-enlace">
            Ofertas
          </NavLink>

          <NavLink to="/iniciar-sesion" className="menu-enlace">
            Iniciar sesión
          </NavLink>

          <NavLink to="/registro" className="menu-boton">
            Registrarse
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Menu;
