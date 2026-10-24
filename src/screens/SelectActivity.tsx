import { useState, type CSSProperties } from 'react';
import { Icon } from '../components/Icons';
import { LevelMap, Stars } from '../components/LevelMap';
import { LoadError, Loading } from '../components/LoadState';
import { useApp } from '../context/AppContext';
import { DIFFICULTY_LABEL } from '../config/labels';
import { useData } from '../hooks/useData';
import { api } from '../services/api';

/** Pantalla de niveles: mapa de niveles y tarjeta del nivel elegido. Datos de levels.json. */
export function SelectActivity() {
  const { notify } = useApp();
  const { data, error, reload, loading } = useData(() => api.levels());
  const [picked, setPicked] = useState<string | null>(null);

  if (loading) return <Loading />;
  if (error || !data) return <LoadError message={error} onRetry={reload} />;

  const levelId = picked ?? data.levels.find(l => l.status === 'current')?.id ?? data.levels[0].id;
  const level = data.levels.find(l => l.id === levelId) ?? data.levels[0];
  const locked = level.status === 'locked';
  const title = level.title ?? 'Por definir';

  const play = () =>
    notify({
      title: `Nivel ${level.number} empezó`,
      body: `${title} · ${DIFFICULTY_LABEL[level.difficulty]}`,
      tone: 'good',
      icon: 'star',
    });

  return (
    <div className="screen-scroll">
      <header className="hub-head">
        <h2>Niveles</h2>
      </header>

      <section className="world-card">
        <div className="world-top">
          <span className="world-kicker">{data.world}</span>
          <span className="stars-count">★ {data.stars}/{data.maxStars}</span>
        </div>
        <div className="xp">
          <div className="xp-fill" style={{ '--p': `${(data.xp / data.xpNext) * 100}%` } as CSSProperties} />
        </div>
        <small>{data.xp}/{data.xpNext} puntos</small>
      </section>

      <section className={`level-card ${locked ? 'is-locked' : ''}`}>
        <div className="pips" aria-label={`Dificultad: ${DIFFICULTY_LABEL[level.difficulty]}`}>
          {[1, 2, 3].map(n => <i key={n} className={n <= level.difficulty ? 'on' : ''} />)}
        </div>
        <h3>Nivel {level.number}</h3>
        <p>{title} · {DIFFICULTY_LABEL[level.difficulty]}</p>
        <Stars count={level.stars} />
        <span className="chip">
          <Icon name="camera" size={14} />
          {data.movementSource}
        </span>
        <button className="play-btn" disabled={locked} onClick={play}>
          {locked ? 'Bloqueado' : 'Jugar'}
        </button>
      </section>

      <LevelMap levels={data.levels} selectedId={levelId} onSelect={setPicked} />
    </div>
  );
}
