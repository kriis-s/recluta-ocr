import { useState } from 'react';
import '../estilos/Registro.css';

const formularioInicial = {
  rol: 'postulante',
  nombre: '',
  apellido: '',
  apellidoMaterno: '',
  sexo: '',
  correo: '',
  contrasena: '',
  confirmarContrasena: '',
  rut: '',
  fechaNacimiento: '',
  telefono: '',
  direccion: '',
  comuna: '',
  cargo: '',
  area: ''
};

function Registro() {
  const [formulario, setFormulario] = useState({ ...formularioInicial });
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

  function validarFormulario() {
    if (!formulario.nombre.trim()) {
      return 'Debe ingresar el nombre.';
    }

    if (!formulario.apellido.trim()) {
      return 'Debe ingresar el apellido.';
    }

    if (formulario.rol === 'postulante' && !formulario.sexo) {
      return 'Debe seleccionar el sexo del postulante.';
    }

    if (!formulario.correo.trim()) {
      return 'Debe ingresar el correo electrónico.';
    }

    if (!formulario.correo.includes('@')) {
      return 'Debe ingresar un correo electrónico válido.';
    }

    if (!formulario.contrasena.trim()) {
      return 'Debe ingresar una contraseña.';
    }

    if (formulario.contrasena.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (formulario.contrasena !== formulario.confirmarContrasena) {
      return 'Las contraseñas no coinciden.';
    }

    if (formulario.rol === 'postulante' && !formulario.rut.trim()) {
      return 'Debe ingresar el RUT del postulante.';
    }

    return '';
  }

  function prepararDatosRegistro() {
    const direccionCompleta = `${formulario.direccion.trim()} ${formulario.comuna.trim()}`.trim();

    return {
      correo: formulario.correo.trim(),
      password: formulario.contrasena,
      rut: formulario.rut.trim(),
      nombres: formulario.nombre.trim(),
      apellido_paterno: formulario.apellido.trim(),
      apellido_materno: formulario.apellidoMaterno.trim() || null,
      fecha_nacimiento: formulario.fechaNacimiento || null,
      telefono: formulario.telefono.trim() || null,
      direccion: direccionCompleta || null,
      sexo: formulario.sexo.trim() || null
    };
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const error = validarFormulario();

    if (error) {
      setMensaje(error);
      setTipoMensaje('error');
      return;
    }

    if (formulario.rol !== 'postulante') {
      setMensaje('Por ahora solo está habilitado el registro de postulantes.');
      setTipoMensaje('error');
      return;
    }

    try {
      setCargando(true);
      setMensaje('');
      setTipoMensaje('');

      const datosRegistro = prepararDatosRegistro();

      const respuesta = await fetch('http://localhost:3001/api/postulantes/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosRegistro)
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(resultado.mensaje || 'No fue posible registrar el postulante.');
        setTipoMensaje('error');
        return;
      }

      setMensaje(resultado.mensaje || 'Postulante registrado correctamente.');
      setTipoMensaje('exito');
      setFormulario({ ...formularioInicial });
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
    <main className="pagina-registro">
      <div className="registro-contenedor">
        <section className="registro-encabezado">
          <h1>Registro de usuario</h1>
          <p>
            Complete los datos solicitados para crear una cuenta dentro de la
            plataforma de reclutamiento.
          </p>
        </section>

        <form className="registro-formulario" onSubmit={manejarEnvio}>
          {mensaje && (
            <div className={`registro-mensaje ${tipoMensaje}`}>
              {mensaje}
            </div>
          )}

          {formulario.rol === 'postulante' && (
            <>
              <h2 className="registro-subtitulo">Datos del postulante</h2>

              <div className="registro-fila">
                <div className="registro-grupo">
                  <label htmlFor="rut">RUT</label>
                  <input
                    type="text"
                    id="rut"
                    name="rut"
                    value={formulario.rut}
                    onChange={manejarCambio}
                    placeholder="12345678-9"
                  />
                </div>

                <div className="registro-grupo">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    placeholder="Ingrese su nombre"
                  />
                </div>
              </div>

              <div className="registro-fila">
                <div className="registro-grupo">
                  <label htmlFor="apellido">Apellido paterno</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formulario.apellido}
                    onChange={manejarCambio}
                    placeholder="Ingrese su apellido paterno"
                  />
                </div>

                <div className="registro-grupo">
                  <label htmlFor="apellidoMaterno">Apellido materno</label>
                  <input
                    type="text"
                    id="apellidoMaterno"
                    name="apellidoMaterno"
                    value={formulario.apellidoMaterno}
                    onChange={manejarCambio}
                    placeholder="Ingrese su apellido materno"
                  />
                </div>

                <div className="registro-grupo">
                  <label htmlFor="sexo">Sexo</label>
                  <select id="sexo" name="sexo" value={formulario.sexo} onChange={manejarCambio}>
                    <option value="">Seleccione sexo</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                  </select>
                </div>
              </div>

              <div className="registro-fila">
                <div className="registro-grupo">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    value={formulario.telefono}
                    onChange={manejarCambio}
                    placeholder="912345678"
                  />
                </div>

                <div className="registro-grupo">
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
              </div>

              <div className="registro-fila">
                <div className="registro-grupo">
                  <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                  <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={formulario.fechaNacimiento}
                    onChange={manejarCambio}
                  />
                </div>

                <div className="registro-grupo">
                  <label htmlFor="direccion">Dirección</label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formulario.direccion}
                    onChange={manejarCambio}
                    placeholder="Ingrese su dirección"
                  />
                </div>
              </div>

              <div className="registro-grupo">
                <label htmlFor="comuna">Comuna</label>
                <input
                  type="text"
                  id="comuna"
                  name="comuna"
                  value={formulario.comuna}
                  onChange={manejarCambio}
                  placeholder="Ingrese su comuna"
                />
              </div>

              <div className="registro-fila">
                <div className="registro-grupo">
                  <label htmlFor="contrasena">Contraseña</label>
                  <input
                    type="password"
                    id="contrasena"
                    name="contrasena"
                    value={formulario.contrasena}
                    onChange={manejarCambio}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div className="registro-grupo">
                  <label htmlFor="confirmarContrasena">Confirmar contraseña</label>
                  <input
                    type="password"
                    id="confirmarContrasena"
                    name="confirmarContrasena"
                    value={formulario.confirmarContrasena}
                    onChange={manejarCambio}
                    placeholder="Repita la contraseña"
                  />
                </div>
              </div>
            </>
          )}

          {formulario.rol === 'reclutador' && (
            <>
              <h2 className="registro-subtitulo">Datos del reclutador</h2>

              <div className="registro-fila">
                <div className="registro-grupo">
                  <label htmlFor="cargo">Cargo</label>
                  <input
                    type="text"
                    id="cargo"
                    name="cargo"
                    value={formulario.cargo}
                    onChange={manejarCambio}
                    placeholder="Ejemplo: Reclutador"
                  />
                </div>

                <div className="registro-grupo">
                  <label htmlFor="area">Área</label>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={formulario.area}
                    onChange={manejarCambio}
                    placeholder="Ejemplo: Recursos Humanos"
                  />
                </div>
              </div>
            </>
          )}

          <div className="registro-acciones">
            <button type="submit" className="boton-principal" disabled={cargando}>
              {cargando ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Registro;
