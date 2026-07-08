import { Routes, Route } from 'react-router-dom';
import Inicio from '../paginas/Inicio';
import IniciarSesion from '../paginas/IniciarSesion';
import Registro from '../paginas/Registro';
import OfertasLaborales from '../paginas/OfertasLaborales';
import PanelPostulante from '../paginas/PanelPostulante';
import PanelReclutador from '../paginas/PanelReclutador';
import NoEncontrado from '../paginas/NoEncontrado';
import CrearOfertaLaboral from '../paginas/CrearOfertaLaboral';
import RutaProtegida from './RutaProtegida';
import DetallePostulante from '../paginas/DetallePostulante';

function RutasAplicacion() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/iniciar-sesion" element={<IniciarSesion />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/ofertas" element={<OfertasLaborales />} />
      <Route path="/reclutador/postulacion/:id_postulacion" element={<DetallePostulante />} />
      <Route
        path="/panel-postulante"
        element={
          <RutaProtegida rolPermitido="POSTULANTE">
            <PanelPostulante />
          </RutaProtegida>
        }
      />

      <Route
        path="/panel-reclutador"
        element={
          <RutaProtegida rolPermitido="RECLUTADOR">
            <PanelReclutador />
          </RutaProtegida>
        }
      />

      <Route
        path="/crear-oferta"
        element={
          <RutaProtegida rolPermitido="RECLUTADOR">
            <CrearOfertaLaboral />
          </RutaProtegida>
        }
      />

      <Route path="*" element={<NoEncontrado />} />
      
    </Routes>
    
  );
}

export default RutasAplicacion;
