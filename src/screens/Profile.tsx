import { useState } from 'react';
import { Card } from '../components/Card';
import { Figure } from '../components/Figure';
import { Icon } from '../components/Icons';
import { LoadError, Loading } from '../components/LoadState';
import { ProfilePhoto } from '../components/ProfilePhoto';
import { useApp } from '../context/AppContext';
import { useTheme, type ThemeMode } from '../context/ThemeContext';
import { GOALS } from '../data/goals';
import { useData } from '../hooks/useData';
import { api } from '../services/api';
import type { TabId } from '../types';

interface Props {
  onNavigate: (tab: TabId) => void;
}

const MODES: { id: ThemeMode; label: string }[] = [
  { id: 'system', label: 'Sistema' },
  { id: 'light', label: 'Claro' },
  { id: 'dark', label: 'Oscuro' },
];

/** Días alrededor de hoy para la tira de calendario (desplazamientos respecto a hoy). */
const WEEK_OFFSETS = [-2, -1, 0, 1, 2];

/** Perfil (estilo perfil.png): foto, logros en anillos, calendario, tienda y avatares. */
export function Profile({ onNavigate }: Props) {
  const { user, session, setAvatar, logout, notify } = useApp();
  const { mode, setMode } = useTheme();
  const { data, error, reload } = useData(() => api.profile());
  const [achId, setAchId] = useState<string | null>(null);

  if (!user) return null;

  const goal = GOALS.find(g => g.id === user.goal)?.label ?? user.goal;
  const tone = data?.avatars.find(a => a.id === user.avatar)?.tone ?? 'indigo';
  const ach = data?.achievements.find(a => a.id === achId) ?? null;
  const unlockedCount = data?.achievements.filter(a => a.unlocked).length ?? 0;

  const today = new Date();
  const days = WEEK_OFFSETS.map(offset => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return {
      offset,
      num: d.getDate(),
      wd: d.toLocaleDateString('es-GT', { weekday: 'short' }).replace('.', ''),
    };
  });
  const monthLabel = today.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' });
  const monthCap = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  const pickAvatar = (id: string) => {
    if (id === user.avatar) return;
    setAvatar(id);
    notify({ title: 'Avatar actualizado', body: 'Tu foto ya tiene el nuevo color.', tone: 'good', icon: 'star' });
  };

  return (
    <div className="screen-scroll profile">
      <section className="profile-hero">
        <div className="profile-nav">
          <button className="circle-light" onClick={() => onNavigate('summary')} aria-label="Volver al inicio">
            <Icon name="arrow" size={20} />
          </button>
          <h2>Perfil</h2>
          <span className="circle-light" aria-hidden="true">
            <Icon name="more" size={18} />
          </span>
        </div>

        <div className="profile-id">
          <ProfilePhoto
            src={data?.photo ?? 'img/profile.png'}
            tone={tone}
            size={112}
            alt={`Foto de ${user.name}`}
          />
          <div className="profile-text">
            <h1>{user.name}</h1>
            <p className="profile-mail">{user.email}</p>
            <p className="profile-goal">Meta: {goal}</p>
            {session === 'offline' && <p className="profile-mail">Modo offline</p>}
          </div>
        </div>
      </section>

      {error && <LoadError message={error} onRetry={reload} />}
      {!data && !error && <Loading />}

      {data && (
        <>
          <section className="week card">
            <div className="week-head">
              <b>{monthCap}</b>
              <span className="streak">Racha: {data.streak} días</span>
            </div>
            <div className="week-days">
              {days.map(d => {
                const active = data.activeDays.includes(d.offset);
                return (
                  <div key={d.offset} className={`day ${d.offset === 0 ? 'today' : ''}`}>
                    <span className="num">{d.num}</span>
                    <span className="wd">{d.wd}</span>
                    <span className={`dot ${active ? 'on' : ''}`} />
                  </div>
                );
              })}
            </div>
          </section>

          <button
            className="store-btn"
            onClick={() => notify({
              title: 'Tienda',
              body: `Próximamente. Tienes ${data.stars} estrellas para canjear.`,
              icon: 'star',
            })}
          >
            <Icon name="bag" size={20} />
            <span>TIENDA</span>
            <b>{data.stars} <Icon name="star" size={16} /></b>
          </button>

          <section className="block">
            <div className="section-head">
              <h3>Logros</h3>
              <span className="muted small-text">{unlockedCount} de {data.achievements.length}</span>
            </div>
            <div className="ach-row">
              {data.achievements.map(a => (
                <button
                  key={a.id}
                  className={`ach ${a.unlocked ? '' : 'locked'} ${a.id === achId ? 'on' : ''}`}
                  onClick={() => setAchId(a.id)}
                  aria-pressed={a.id === achId}
                  aria-label={`${a.title}${a.unlocked ? '' : ', bloqueado'}`}
                >
                  <span className={`ach-ring tone-${a.tone}`}>
                    <span className="ach-core">
                      <Icon name="star" size={22} />
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <p className="ach-detail" aria-live="polite">
              {ach ? <><b>{ach.title}</b> · {ach.detail}{ach.unlocked ? '' : ' (bloqueado)'}</> : 'Toca un logro para ver cómo se gana.'}
            </p>
          </section>

          <section className="block">
            <div className="section-head">
              <h3>Avatares</h3>
            </div>
            <div className="avatar-grid">
              {data.avatars.map(a => {
                const on = a.id === user.avatar;
                return (
                  <button
                    key={a.id}
                    className={`avatar-tile tone-${a.tone} ${on ? 'on' : ''}`}
                    onClick={() => pickAvatar(a.id)}
                    aria-pressed={on}
                    aria-label={`Avatar ${a.tone}`}
                  >
                    <Figure className="avatar-figure" />
                    {on && <span className="tile-check"><Icon name="check" size={16} /></span>}
                  </button>
                );
              })}
            </div>
          </section>
        </>
      )}

      <Card title="Apariencia">
        <div className="switch" role="radiogroup" aria-label="Tema">
          {MODES.map(m => (
            <button
              key={m.id}
              role="radio"
              aria-checked={mode === m.id}
              className={`switch-btn ${mode === m.id ? 'on' : ''}`}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </Card>

      <Card title="Cuenta">
        <dl className="info-rows">
          <div><dt>Meta</dt><dd>{goal}</dd></div>
          <div><dt>Sesión</dt><dd>{session === 'offline' ? 'Modo offline' : 'En línea'}</dd></div>
        </dl>
      </Card>

      <button className="btn-ghost" onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
