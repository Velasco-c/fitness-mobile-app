import { Bars } from '../components/Bars';
import { Card } from '../components/Card';
import { Icon } from '../components/Icons';
import { AwardRings, Ring } from '../components/Ring';
import { useApp } from '../context/AppContext';
import { SUMMARY } from '../data/summary';
import type { TabId } from '../types';

interface Props {
  onNavigate: (tab: TabId) => void;
}

const saludo = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Buenos días' : h < 18 ? 'Buenas tardes' : 'Buenas noches';
};

export function Summary({ onNavigate }: Props) {
  const { user, unread, setPanelOpen } = useApp();
  const { date, move, steps, distanceMi, flights, award } = SUMMARY;

  // Con perfil muestra el nombre; sin perfil, un título general
  const titulo = user?.name ?? 'Mi panel';
  const subtitulo = user ? `${saludo()} · ${date}` : date;

  return (
    <div className="screen-scroll">
      <header className="screen-head">
        <div>
          <h1>{titulo}</h1>
          <p className="muted">{subtitulo}</p>
        </div>
        <div className="head-actions">
          <button
            className="icon-btn"
            onClick={() => setPanelOpen(true)}
            aria-label={`Notificaciones, ${unread} sin leer`}
          >
            <Icon name="bell" />
            {unread > 0 && <span className="badge">{unread}</span>}
          </button>
          <button className="avatar" onClick={() => onNavigate('profile')} aria-label="Perfil">
            <Icon name="profile" />
          </button>
        </div>
      </header>

      <Card title="Meta diaria">
        <div className="ring-row">
          <Ring progress={move.value / move.goal} size={124} stroke={22} color="var(--move)" />
          <div>
            <span className="label">Movimiento</span>
            <p className="move-value">
              {move.value}/{move.goal}<small>CAL</small>
            </p>
          </div>
        </div>
      </Card>

      <div className="grid-2">
        <Card title="Pasos" expandable>
          <span className="label">Hoy</span>
          <p className="big" style={{ color: 'var(--steps)' }}>{steps.total.toLocaleString('es-GT')}</p>
          <Bars values={steps.hourly} color="var(--steps)" />
        </Card>
        <Card title="Distancia" expandable>
          <span className="label">Hoy</span>
          <p className="big" style={{ color: 'var(--distance)' }}>
            {distanceMi}<small>MI</small>
          </p>
          <Bars values={steps.hourly} color="var(--distance)" />
        </Card>
        <Card title="Entrenos" expandable>
          <p className="empty">No hay entrenamientos registrados.</p>
        </Card>
        <Card title="Logros" expandable>
          <AwardRings />
          <p className="award-title">{award.title}</p>
          <p className="muted small">{award.detail}</p>
        </Card>
      </div>

      <Card title="niveles realizados">
        <p className="big">{flights}</p>
      </Card>
    </div>
  );
}