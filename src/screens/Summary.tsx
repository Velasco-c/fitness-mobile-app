import type { ReactNode } from 'react';
import { ProfilePhoto } from '../components/ProfilePhoto';
import { Card } from '../components/Card';
import { Icon, type IconName } from '../components/Icons';
import { LoadError, Loading } from '../components/LoadState';
import { AwardRings, Ring } from '../components/Ring';
import { useApp } from '../context/AppContext';
import { useData } from '../hooks/useData';
import { api } from '../services/api';
import type { TabId } from '../types';

interface Props {
  onNavigate: (tab: TabId) => void;
}

const saludo = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Buenos días' : h < 18 ? 'Buenas tardes' : 'Buenas noches';
};

const fechaHoy = () => {
  const texto = new Date().toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

/** Curva suavizada para el gráfico de estrellas. Devuelve la línea y el área cerrada. */
function smoothSeries(values: number[], w: number, h: number) {
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? w / (values.length - 1) : w;
  const pts = values.map((v, i) => [i * step, h - (v / max) * h * 0.8 - h * 0.1] as const);
  let line = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    line += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${((cx + nx) / 2).toFixed(1)} ${((cy + ny) / 2).toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  line += ` L${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  return { line, area };
}

interface TileProps {
  tone: 'green' | 'indigo' | 'slate' | 'white';
  icon: IconName;
  value: ReactNode;
  label: string;
  sub?: string;
  index: number;
  children?: ReactNode;
}

/** Tarjeta de color del dashboard (estilo horarios.png). */
function Tile({ tone, icon, value, label, sub, index, children }: TileProps) {
  return (
    <section className={`tile tile-${tone}`} style={{ animationDelay: `${index * 90}ms` }}>
      <span className="tile-icon"><Icon name={icon} size={18} /></span>
      {children}
      <div className="tile-foot">
        <span className="tile-value">{value}</span>
        <span className="tile-label">{label}</span>
        {sub && <span className="tile-sub">{sub}</span>}
      </div>
    </section>
  );
}

/** Dashboard: saludo con el nombre, cuadrícula de tarjetas y logros. Todo viene de JSON. */
export function Summary({ onNavigate }: Props) {
  const { user, session, unread, setPanelOpen } = useApp();
  const summary = useData(() => api.summary());
  const levels = useData(() => api.levels());
  const profile = useData(() => api.profile());

  const s = summary.data;
  const lv = levels.data;
  const failed = summary.error ?? levels.error;
  const reload = () => { summary.reload(); levels.reload(); };

  const tone = profile.data?.avatars.find(a => a.id === user?.avatar)?.tone ?? 'indigo';
  const next = lv?.levels.find(l => l.status === 'current');
  const weekly = s?.weekly.map(d => d.value) ?? [];
  const spark = smoothSeries(weekly.length > 1 ? weekly : [0, 0], 160, 70);

  return (
    <div className="screen-scroll summary">
      <header className="screen-head summary-head">
        <div>
          <p className="hello">{saludo()}, {user?.name}</p>
          <h1>Tu panel</h1>
          <p className="muted small-text">{fechaHoy()}</p>
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
          <button className="avatar-btn" onClick={() => onNavigate('profile')} aria-label="Perfil">
            <ProfilePhoto src={profile.data?.photo ?? 'img/profile.png'} tone={tone} size={46} alt="Perfil" />
          </button>
        </div>
      </header>

      {session === 'offline' && (
        <p className="offline-chip"><Icon name="wifi-off" size={16} /> Sin conexión · datos guardados</p>
      )}

      {failed && <LoadError message={failed} onRetry={reload} />}

      {!failed && (!s || !lv) && <Loading />}

      {s && lv && (
        <>
          <div className="bento">
            <Tile tone="green" icon="check" value={s.completedLevels} label="Niveles completados" sub={`de ${lv.levels.length}`} index={0} />
            <Tile tone="indigo" icon="star" value={`+${s.starsThisWeek}`} label="Estrellas esta semana" index={1}>
              <svg className="spark" viewBox="0 0 160 70" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#ffffff" stopOpacity="0.45" />
                    <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path className="spark-area" d={spark.area} fill="url(#spark-fill)" />
                <path className="spark-line" d={spark.line} pathLength={1} />
              </svg>
            </Tile>
            <Tile tone="slate" icon="flame" value={s.trainings} label="Entrenos esta semana" index={2} />
            <Tile
              tone="white"
              icon="play"
              value={<>{s.levelsToday}<small>/{s.goal}</small></>}
              label="Meta de hoy"
              sub={next ? `Siguiente: Nivel ${next.number}` : undefined}
              index={3}
            >
              <div className="tile-ring">
                <Ring progress={s.levelsToday / s.goal} size={58} stroke={9} color="var(--kf-brand)" />
              </div>
            </Tile>
          </div>

          <Card title="Logros">
            <div className="achv">
              <AwardRings />
              <div className="achv-text">
                <p className="achv-value">{lv.stars}<small> de {lv.maxStars} estrellas</small></p>
                <div className="achv-bar" aria-hidden="true">
                  <span style={{ width: `${(lv.stars / lv.maxStars) * 100}%` }} />
                </div>
                <p className="muted small-text">Mundo: {lv.world}</p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
