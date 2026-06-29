import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function RutaProtegida({ children, rolPermitido }) {
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const respuesta = await fetch('http://localhost:3001/api/autenticacion/perfil', {
          method: 'GET',
          credentials: 'include'
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
          setUsuario(null);
          return;
        }

        setUsuario(resultado.usuario);
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    };

    verificarSesion();
  }, []);

  if (cargando) {
    return (
      <main style={{ padding: '40px', textAlign: 'center' }}>
        <p>Verificando sesión...</p>
      </main>
    );
  }

  if (!usuario) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  if (rolPermitido && usuario.rol !== rolPermitido) {
    if (usuario.rol === 'POSTULANTE') {
      return <Navigate to="/panel-postulante" replace />;
    }

    if (usuario.rol === 'RECLUTADOR') {
      return <Navigate to="/panel-reclutador" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaProtegida;