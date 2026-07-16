import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../estilos/IniciarSesion.css';
import API_URL from '../config/api';

function IniciarSesion() {
  const navegar = useNavigate();

  const [formulario, setFormulario] = useState({
    correo: '',
    contrasena: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario({
      ...formulario,
      [name]: value
    });
  }

  // Primero se validan los datos localmente para no enviar solicitudes incompletas.
  function validarFormulario() {
    if (!formulario.correo.trim()) {
      return 'Debe ingresar el correo electrónico.';
    }

    if (!formulario.correo.includes('@')) {
      return 'Debe ingresar un correo electrónico válido.';
    }

    if (!formulario.contrasena.trim()) {
      return 'Debe ingresar la contraseña.';
    }

    return '';
  }

  // Cada tipo de usuario tiene un panel con opciones diferentes.
  function redirigirSegunRol(rolUsuario) {
    if (rolUsuario === 'POSTULANTE') {
      navegar('/panel-postulante');
      return true;
    }

    if (rolUsuario === 'RECLUTADOR') {
      navegar('/panel-reclutador');
      return true;
    }

    return false;
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const error = validarFormulario();

    if (error) {
      setMensaje(error);
      setTipoMensaje('error');
      return;
    }

    try {
      setCargando(true);
      setMensaje('');
      setTipoMensaje('');

      const datosLogin = {
        correo: formulario.correo.trim(),
        password: formulario.contrasena
      };

      const respuesta = await fetch(`${API_URL}/api/autenticacion/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(datosLogin)
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(resultado.mensaje || 'No fue posible iniciar sesión.');
        setTipoMensaje('error');
        return;
      }

      setMensaje(resultado.mensaje || 'Inicio de sesión correcto.');
      setTipoMensaje('exito');

      if (redirigirSegunRol(resultado.usuario?.rol)) {
        return;
      }

      setMensaje('Rol de usuario no reconocido.');
      setTipoMensaje('error');
    } catch (error) {
      console.error('Error al conectar con el backend:', error);

      setMensaje(
        'No se pudo conectar con el servidor. Verifique que el backend esté activo.'
      );
      setTipoMensaje('error');
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="pagina-login">
      <div className="login-contenedor">
        <section className="login-encabezado">
          <h1>Iniciar sesión</h1>
          <p>
            Ingrese sus credenciales para acceder a la plataforma de reclutamiento
            y gestión documental.
          </p>
        </section>

        <form className="login-formulario" onSubmit={manejarEnvio}>
          {mensaje && (
            <div className={`login-mensaje ${tipoMensaje}`}>
              {mensaje}
            </div>
          )}

          <div className="login-grupo">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formulario.correo}
              onChange={manejarCambio}
              placeholder="correo@ejemplo.cl"
            />
          </div>

          <div className="login-grupo">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formulario.contrasena}
              onChange={manejarCambio}
              placeholder="Ingrese su contraseña"
            />
          </div>

          <div className="login-acciones">
            <button type="submit" className="boton-principal" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Acceder'}
            </button>
          </div>

          <div className="login-ayuda">
            <span>¿No tienes una cuenta? </span>
            <Link to="/registro">Regístrate como postulante</Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default IniciarSesion;
