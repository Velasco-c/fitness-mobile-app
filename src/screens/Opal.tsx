import { LoadError, Loading } from '../components/LoadState';
import { WaterTracker } from '../components/WaterTracker';
import { useData } from '../hooks/useData';
import { api } from '../services/api';

const fechaHoy = () => {
  const texto = new Date().toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

/** Hoy: seguimiento de agua. Datos de water.json (meta, vasos y tomas del backend simulado). */
export function Opal() {
  const water = useData(() => api.water());

  if (water.error) return <LoadError message={water.error} onRetry={water.reload} />;
  if (!water.data) return <Loading />;

  return (
    <div className="screen-scroll hoy">
      <header className="hoy-head">
        <p className="hello">{fechaHoy()}</p>
        <h1>Hoy</h1>
      </header>

      <WaterTracker data={water.data} />
    </div>
  );
}
