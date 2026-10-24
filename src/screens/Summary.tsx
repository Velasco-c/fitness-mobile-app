import type { KeyboardEvent, ReactNode } from 'react';
import { AvatarBadge } from '../components/AvatarBadge';
import { Card } from '../components/Card';
import { Icon, type IconName } from '../components/Icons';
import { LoadError, Loading } from '../components/LoadState';
import { AwardRings, Ring } from '../components/Ring';
import { FEATURES } from '../config/features';
import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';
import { useData } from '../hooks/useData';
import { api } from '../services/api';
import type { TabId } from '../types';
import { buildCategories, summarizeLevels } from '../utils/levels';
import { pictureSrc } from '../utils/picture';
import { levelsOn, trainingsLastWeek, weekStars } from '../utils/progress';

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
  onClick?: () => void;
}

/** Tarjeta de color del dashboard (estilo horarios.png). Si tiene onClick, se puede tocar. */
function Tile({ tone, icon, value, label, sub, index, children, onClick }: TileProps) {
  const interactive = onClick
    ? { role: 'button' as const, tabIndex: 0, onClick, onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter') onClick(); } }
    : {};
  return (
    <section className={`tile tile-${tone}`} style={{ animationDelay: `${index * 90}ms` }} {...interactive}>
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

/** Dashboard: saludo, tarjetas y logros. Niveles, estrellas y racha salen del progreso guardado. */
export function Summary({ onNavigate }: Props) {
  const { user, session, unread, setPanelOpen, logout } = useApp();
  const { date: today, state, bestStars, setFocus, avatar, photo, tone } = useProgress();
  const summary = useData(() => api.summary());
  const levels = useData(() => api.levels());
  const profile = useData(() => api.profile());

  const goal = summary.data?.goal ?? 0;
  const totals = levels.data ? summarizeLevels(buildCategories(levels.data, bestStars)) : null;
  const failed = summary.error ?? levels.error;
  const reload = () => { summary.reload(); levels.reload(); };

  const week = weekStars(state, today);
  const starsWeek = week.reduce((sum, d) => sum + d.stars, 0);
  const weeklyValues = week.map(d => d.stars);
  const spark = smoothSeries(weeklyValues.length > 1 ? weeklyValues : [0, 0], 160, 70);
  const playedToday = levelsOn(state, today);

  const src = pictureSrc(avatar, photo, profile.data?.avatars ?? []);

  const goNext = () => {
    if (!totals?.next) return;
    setFocus({ categoryId: totals.next.category.id, number: totals.next.level.number });
    onNavigate('activity');
  };

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
          {FEATURES.profile && (
            <button className="avatar-btn" onClick={() => onNavigate('profile')} aria-label="Perfil">
              <AvatarBadge src={src} tone={tone} size={46} />
            </button>
          )}
        </div>
      </header>

      {session === 'offline' && (
        <p className="offline-chip"><Icon name="wifi-off" size={16} /> Sin conexión · datos guardados</p>
      )}

      {failed && <LoadError message={failed} onRetry={reload} />}

      {!failed && (!summary.data || !totals) && <Loading />}

      {summary.data && totals && (
        <>
          <div className="bento">
            <Tile tone="green" icon="check" value={totals.done} label="Niveles completados" sub={`de ${totals.levels}`} index={0} />
            <Tile tone="indigo" icon="star" value={`+${starsWeek}`} label="Estrellas esta semana" index={1}>
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
            <Tile tone="slate" icon="flame" value={trainingsLastWeek(state, today)} label="Entrenos esta semana" index={2} />
            <Tile
              tone="white"
              icon="play"
              value={<>{playedToday}<small>/{goal}</small></>}
              label="Meta de hoy"
              sub={totals.next ? `Siguiente: ${totals.next.category.name} ${totals.next.level.number}` : 'Todo al día'}
              index={3}
              onClick={totals.next ? goNext : undefined}
            >
              <div className="tile-ring">
                <Ring progress={goal ? playedToday / goal : 0} size={58} stroke={9} color="var(--kf-brand)" />
              </div>
            </Tile>
          </div>

          <Card title="Logros">
            <div className="achv">
              <AwardRings />
              <div className="achv-text">
                <p className="achv-value">{totals.stars}<small> de {totals.maxStars} estrellas</small></p>
                <div className="achv-bar" aria-hidden="true">
                  <span style={{ width: `${totals.maxStars ? (totals.stars / totals.maxStars) * 100 : 0}%` }} />
                </div>
                <p className="muted small-text">{totals.categories} categorías · {totals.done} de {totals.levels} niveles</p>
              </div>
            </div>
          </Card>
        </>
      )}

      {!FEATURES.profile && (
        <button className="btn-ghost" onClick={logout}>Cerrar sesión</button>
      )}
    </div>
  );
}
