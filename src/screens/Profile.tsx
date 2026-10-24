import { useRef, useState, type ChangeEvent, type CSSProperties } from 'react';
import { AvatarBadge } from '../components/AvatarBadge';
import { Card } from '../components/Card';
import { Icon } from '../components/Icons';
import { LoadError, Loading } from '../components/LoadState';
import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';
import { useTheme, type ThemeMode } from '../context/ThemeContext';
import { useData } from '../hooks/useData';
import { api } from '../services/api';
import type { AvatarTone, TabId } from '../types';
import { isUnlocked } from '../utils/achievements';
import { readAvatarImage } from '../utils/image';
import { pictureSrc } from '../utils/picture';
import { isActiveOffset, streakOf, ymd } from '../utils/progress';

interface Props {
  onNavigate: (tab: TabId) => void;
}

const MODES: { id: ThemeMode; label: string }[] = [
  { id: 'system', label: 'Sistema' },
  { id: 'light', label: 'Claro' },
  { id: 'dark', label: 'Oscuro' },
];

/** Colores de fondo que puede elegir el niño. */
const TONES: AvatarTone[] = ['orange', 'indigo', 'royal', 'sky', 'teal', 'red', 'pink', 'green', 'yellow', 'gray', 'navy'];

/** Colores claros: el texto del encabezado va en azul marino para leerse. */
const LIGHT_TONES: AvatarTone[] = ['yellow', 'green', 'sky', 'gray'];

/** Días alrededor de hoy para la tira de calendario (desplazamientos respecto a hoy). */
const WEEK_OFFSETS = [-2, -1, 0, 1, 2];

/**
 * Perfil: el encabezado toma el color del avatar; el círculo muestra la
 * ilustración, la foto propia o solo el color. El lápiz abre la edición de foto
 * y color. Nombre y correo vienen de la cuenta; logros, racha y avatar, del progreso.
 */
export function Profile({ onNavigate }: Props) {
  const { user, session, logout, notify } = useApp();
  const { mode, setMode } = useTheme();
  const { now, state, avatar, photo, tone, setPicture, setTone, achievements } = useProgress();
  const { data, error, reload } = useData(() => api.profile());
  const [achId, setAchId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const todayKey = ymd(now);
  const streak = streakOf(state, todayKey);
  const arts = data?.avatars ?? [];
  const src = pictureSrc(avatar, photo, arts);
  const ach = achievements.find(a => a.def.id === achId) ?? null;
  const unlockedCount = achievements.filter(isUnlocked).length;

  const days = WEEK_OFFSETS.map(offset => {
    const d = new Date(now);
    d.setDate(now.getDate() + offset);
    return {
      offset,
      num: d.getDate(),
      wd: d.toLocaleDateString('es-GT', { weekday: 'short' }).replace('.', ''),
    };
  });
  const monthLabel = now.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' });
  const monthCap = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  const pickArt = (id: string) => {
    const art = arts.find(a => a.id === id);
    if (!art || id === avatar) return;
    setPicture({ kind: 'art', id, tone: art.tone });
    notify({
      title: 'Avatar cambiado',
      body: 'Tu foto y el color de fondo ya son los de tu nuevo avatar.',
      tone: 'good',
      icon: 'star',
    });
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    readAvatarImage(file)
      .then(url => {
        setPicture({ kind: 'photo', url });
        notify({ title: 'Foto cambiada', body: 'Tu foto ya está en el perfil.', tone: 'good', icon: 'camera' });
      })
      .catch((err: unknown) => {
        notify({
          title: 'No se pudo usar la imagen',
          body: err instanceof Error ? err.message : 'Prueba con otra foto.',
          tone: 'bad',
          icon: 'camera',
        });
      });
  };

  const removePicture = () => {
    setPicture({ kind: 'none' });
    notify({ title: 'Foto quitada', body: 'Tu perfil queda solo con el color de fondo.', icon: 'star' });
  };

  const heroInk = LIGHT_TONES.includes(tone) ? 'var(--kf-navy)' : 'var(--kf-white)';

  return (
    <div className="screen-scroll profile">
      <section
        className={`profile-hero tone-${tone}`}
        style={{ '--hero-ink': heroInk } as CSSProperties}
      >
        <div className="profile-nav">
          <button className="circle-light" onClick={() => onNavigate('summary')} aria-label="Volver al inicio">
            <Icon name="arrow" size={20} />
          </button>
          <h2>Perfil</h2>
          <button className="circle-light" onClick={() => setEditing(true)} aria-label="Editar foto y color">
            <Icon name="pencil" size={18} />
          </button>
        </div>

        <div className="profile-id">
          <AvatarBadge src={src} tone={tone} size={112} />
          <div className="profile-text">
            <h1>{user.name}</h1>
            <p className="profile-mail">{user.email}</p>
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
              <span className="streak">Racha: {streak} {streak === 1 ? 'día' : 'días'}</span>
            </div>
            <div className="week-days">
              {days.map(d => {
                const active = isActiveOffset(state, todayKey, d.offset);
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

          <section className="block">
            <div className="section-head">
              <h3>Logros</h3>
              <span className="muted small-text">{unlockedCount} de {achievements.length}</span>
            </div>
            <div className="ach-row">
              {achievements.map(a => {
                const on = isUnlocked(a);
                return (
                  <button
                    key={a.def.id}
                    className={`ach ${on ? '' : 'locked'} ${a.def.id === achId ? 'on' : ''}`}
                    onClick={() => setAchId(a.def.id)}
                    aria-pressed={a.def.id === achId}
                    aria-label={`${a.def.title}${on ? '' : ', bloqueado'}`}
                  >
                    <span className={`ach-ring tone-${a.def.tone}`}>
                      <span className="ach-core">
                        <Icon name="star" size={22} />
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="ach-detail" aria-live="polite">
              {ach
                ? <><b>{ach.def.title}</b> · {ach.def.detail}{isUnlocked(ach) ? ' · Desbloqueado' : ` · ${ach.value} de ${ach.target}`}</>
                : 'Toca un logro para ver cómo se gana.'}
            </p>
          </section>

          <section className="block">
            <div className="section-head">
              <h3>Avatares</h3>
            </div>
            <div className="avatar-grid">
              {arts.map(a => {
                const on = a.id === avatar;
                return (
                  <button
                    key={a.id}
                    className={`avatar-tile art tone-${a.tone} ${on ? 'on' : ''}`}
                    onClick={() => pickArt(a.id)}
                    aria-pressed={on}
                    aria-label={`Avatar ${a.id}`}
                  >
                    <img src={a.src} alt="" draggable={false} />
                    {on && <span className="tile-check"><Icon name="check" size={16} /></span>}
                  </button>
                );
              })}
            </div>
            <p className="muted small-text avatar-hint">Toca el lápiz de arriba para subir tu foto o solo elegir un color.</p>
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
          <div><dt>Sesión</dt><dd>{session === 'offline' ? 'Modo offline' : 'En línea'}</dd></div>
        </dl>
      </Card>

      <button className="btn-ghost" onClick={logout}>Cerrar sesión</button>

      {editing && (
        <div className="kf-sheet-layer" onClick={() => setEditing(false)}>
          <div
            className="kf-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Editar foto y color"
            onClick={e => e.stopPropagation()}
          >
            <h3>Editar perfil</h3>
            <p className="muted small-text">Tu nombre y tu correo no cambian aquí.</p>

            <div className="edit-preview">
              <AvatarBadge src={src} tone={tone} size={96} />
            </div>

            <div className="edit-actions">
              <button className="btn-primary" onClick={() => fileRef.current?.click()}>Subir mi foto</button>
              <button className="link-btn center" onClick={removePicture}>Quitar foto (solo color)</button>
            </div>

            <h4 className="edit-label">Color de fondo</h4>
            <div className="swatches" role="radiogroup" aria-label="Color de fondo">
              {TONES.map(t => (
                <button
                  key={t}
                  role="radio"
                  aria-checked={tone === t}
                  aria-label={t}
                  className={`swatch tone-${t} ${tone === t ? 'on' : ''}`}
                  onClick={() => setTone(t)}
                />
              ))}
            </div>

            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
          </div>
        </div>
      )}
    </div>
  );
}
