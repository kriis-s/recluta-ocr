import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import '../estilos/Menu.css';

function Menu() {
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const respuesta = await fetch('http://localhost:3001/api/autenticacion/perfil', {
          method: 'GET',
          credentials: 'include'
        });

        const resultado = await respuesta.json();
        if(!resultado.ok) {
          setUsuario(null);
          return;
        }

        setUsuario(resultado.usuario);
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
        setUsuario(null);
      }
    };
    
    verificarSesion();
  }, [ubicacion.pathname]);

  const cerrarSesion = async () => {
    try {
      await fetch('http://localhost:3001/api/autenticacion/cerrar-sesion', {
        method: 'POST',
        credentials: 'include'
      });

      setUsuario(null);
      navegar('/iniciar-sesion');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

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
          {usuario?.rol ==='POSTULANTE' && (
            <NavLink to="/panel-postulante" className="menu-enlace">
              Panel postulante
            </NavLink>
          )}
          {usuario?.rol ==='RECLUTADOR' && (
            <>
            <NavLink to="/panel-reclutador" className="menu-enlace">
              Panel reclutador
            </NavLink>
            <NavLink to="/crear-oferta" className="menu-enlace">
              Crear oferta
            </NavLink>
            </>
          )}

          {!usuario && (
            <>
              <NavLink to="/iniciar-sesion" className="menu-enlace">
                Iniciar sesión
              </NavLink>

              <NavLink to="/registro" className="menu-boton">
                Registrarse
              </NavLink>

            </>
          )}  

          {usuario && (
            <button type="button" className="menu-boton" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          )}
            
        </nav>
      </div>
    </header>
  );
}

export default Menu;
