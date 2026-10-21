import { useState, type CSSProperties } from 'react';
import { Icon } from '../components/Icons';
import { LevelMap, Stars } from '../components/LevelMap';
import { useApp } from '../context/AppContext';
import { LIVE_SOURCES, POST_SOURCES } from '../data/devices';
import { DIFFICULTY_LABEL, LEVELS, PLAYER } from '../data/levels';

export function SelectActivity() {
  const { notify } = useApp();
  const [levelId, setLevelId] = useState(
    LEVELS.find(l => l.status === 'current')?.id ?? LEVELS[0].id,
  );
  const [sourceIdx, setSourceIdx] = useState(0);

  const level = LEVELS.find(l => l.id === levelId) ?? LEVELS[0];
  const source = LIVE_SOURCES[sourceIdx];
  const post = POST_SOURCES[0];
  const locked = level.status === 'locked';

  const play = () =>
    notify({
      title: `${level.name} empezó`,
      body: `${level.minutes} min · ritmo cardíaco: ${source.name}`,
      tone: 'good',
    });

  return (
    <div className="screen-scroll">
      <header className="hub-head">
        <button className="icon-btn" aria-label="Cerrar"><Icon name="close" /></button>
        <h2>Elegir actividad</h2>
        <span className="icon-btn" aria-hidden="true"><Icon name="pulse" /></span>
      </header>

      <section className="world-card">
        <div className="world-top">
          <span className="world-kicker">{PLAYER.world}</span>
          <span className="stars-count">★ {PLAYER.stars}/{PLAYER.maxStars}</span>
        </div>
        <div className="xp">
          <div className="xp-fill" style={{ '--p': `${(PLAYER.xp / PLAYER.xpNext) * 100}%` } as CSSProperties} />
        </div>
        <small>{PLAYER.xp}/{PLAYER.xpNext} puntos · {post.name} · {post.battery}%</small>
      </section>

      <section className={`level-card ${locked ? 'is-locked' : ''}`}>
        <div className="pips" aria-label={`Dificultad: ${DIFFICULTY_LABEL[level.difficulty]}`}>
          {[1, 2, 3].map(n => <i key={n} className={n <= level.difficulty ? 'on' : ''} />)}
        </div>
        <h3>{level.name}</h3>
        <p className="muted">{level.minutes} min · {DIFFICULTY_LABEL[level.difficulty]}</p>
        <Stars count={level.stars} />
        <button className="chip" onClick={() => setSourceIdx(i => (i + 1) % LIVE_SOURCES.length)}>
          <Icon name="heart" size={14} />
          {source.name}{source.hr !== undefined && ` · ${source.hr} bpm`}
        </button>
        <button className="play-btn" disabled={locked} onClick={play}>
          {locked ? 'Bloqueado' : 'Jugar'}
        </button>
      </section>

      <LevelMap levels={LEVELS} selectedId={levelId} onSelect={setLevelId} />
    </div>
  );
}