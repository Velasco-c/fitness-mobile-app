import { WaterTracker } from '../components/WaterTracker';
import { useProgress } from '../context/ProgressContext';

const fechaHoy = (d: Date) => {
  const texto = d.toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

/** Hoy: hidratación en vasos. El progreso viene de ProgressContext. */
export function Opal() {
  const { now } = useProgress();

  return (
    <div className="screen-scroll hoy">
      <header className="hoy-head">
        <p className="hello">{fechaHoy(now)}</p>
        <h1>Hoy</h1>
      </header>

      <WaterTracker />
    </div>
  );
}
