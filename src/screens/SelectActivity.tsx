import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { CategoryPicker } from '../components/CategoryPicker';
import { Icon } from '../components/Icons';
import { LevelMap, Stars } from '../components/LevelMap';
import { LoadError, Loading } from '../components/LoadState';
import { DIFFICULTY_LABEL } from '../config/labels';
import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';
import { useData } from '../hooks/useData';
import { api } from '../services/api';
import type { Category, Difficulty } from '../types';
import { buildCategories, summarizeLevels } from '../utils/levels';

const DIFFICULTIES: Difficulty[] = [1, 2, 3];

/**
 * Pestaña Niveles en dos pasos: primero se elige la categoría y después se ve
 * su mapa de niveles. Categorías y niveles salen de levels.json; el progreso,
 * de ProgressContext. Si se llega desde «Meta de hoy», abre el nivel siguiente.
 */
export function SelectActivity() {
  const { user, notify } = useApp();
  const { focus, clearFocus, bestStars, completeLevel } = useProgress();
  const { data, error, reload, loading } = useData(() => api.levels());
  const [openId, setOpenId] = useState<string | null>(focus?.categoryId ?? null);
  const [startNumber] = useState<number | null>(focus?.number ?? null);

  useEffect(() => {
    if (focus) clearFocus();
  }, [focus, clearFocus]);

  const categories = useMemo(() => (data ? buildCategories(data, bestStars) : []), [data, bestStars]);
  const totals = useMemo(() => summarizeLevels(categories), [categories]);

  if (loading) return <Loading />;
  if (error || !data) return <LoadError message={error} onRetry={reload} />;

  const open = categories.find(c => c.id === openId);
  if (open) {
    return (
      <CategoryLevels
        key={open.id}
        category={open}
        movementSource={data.movementSource}
        startNumber={startNumber}
        onBack={() => setOpenId(null)}
        onFinish={(key, stars) => {
          completeLevel(key, stars);
          notify({
            title: 'Nivel terminado',
            body: `Ganaste ${stars} ${stars === 1 ? 'estrella' : 'estrellas'}. ¡Sigue así!`,
            tone: 'good',
            icon: 'star',
          });
        }}
      />
    );
  }

  return (
    <CategoryPicker
      name={user?.name ?? ''}
      categories={categories}
      totals={totals}
      onOpen={setOpenId}
    />
  );
}

interface CategoryLevelsProps {
  category: Category;
  movementSource: string;
  startNumber: number | null;
  onBack: () => void;
  onFinish: (key: string, stars: number) => void;
}

/** Mapa de una categoría: progreso, tarjeta del nivel elegido y camino de niveles. */
function CategoryLevels({ category, movementSource, startNumber, onBack, onFinish }: CategoryLevelsProps) {
  const [picked, setPicked] = useState<string | null>(
    startNumber ? `${category.id}:${startNumber}` : null,
  );
  const [playing, setPlaying] = useState(false);
  const { levels } = category;
  const current = levels.find(l => l.status === 'current') ?? levels[0];
  const level = levels.find(l => l.id === (picked ?? current.id)) ?? current;
  const locked = level.status === 'locked';
  const title = level.title ?? 'Por definir';
  const pct = (category.done / levels.length) * 100;

  const finish = (stars: number) => {
    setPlaying(false);
    onFinish(level.id, stars);
  };

  return (
    <>
      <div className="screen-scroll levels-map">
        <header className="hub-head">
          <button className="circle-light" onClick={onBack} aria-label="Volver a categorías">
            <Icon name="arrow" size={20} />
          </button>
          <h2>{category.name}</h2>
          <span className="icon-btn-spacer" aria-hidden="true" />
        </header>

        <section className="world-card">
          <div className="world-top">
            <span className="world-kicker">{category.subtitle}</span>
            <span className="stars-count">★ {category.stars}/{category.maxStars}</span>
          </div>
          <div className="xp">
            <div className="xp-fill" style={{ '--p': `${pct}%` } as CSSProperties} />
          </div>
          <small>{category.done}/{levels.length} niveles completados</small>
          <div className="world-legend" aria-label="Dificultad">
            {DIFFICULTIES.map(d => (
              <span key={d}><i className={`diff-${d}`} />{DIFFICULTY_LABEL[d]}</span>
            ))}
          </div>
        </section>

        <section className={`level-card ${locked ? 'is-locked' : ''}`}>
          <div className="pips" aria-label={`Dificultad: ${DIFFICULTY_LABEL[level.difficulty]}`}>
            {DIFFICULTIES.map(n => <i key={n} className={n <= level.difficulty ? 'on' : ''} />)}
          </div>
          <h3>Nivel {level.number}</h3>
          <p>{title} · {DIFFICULTY_LABEL[level.difficulty]}</p>
          <Stars count={level.stars} />
          <span className="chip">
            <Icon name="camera" size={14} />
            {movementSource}
          </span>
          <button className="play-btn" disabled={locked} onClick={() => setPlaying(true)}>
            {locked ? 'Bloqueado' : 'Jugar'}
          </button>
        </section>

        <LevelMap levels={levels} selectedId={level.id} onSelect={setPicked} />
      </div>

      {playing && (
        <div className="kf-sheet-layer" onClick={() => setPlaying(false)}>
          <div
            className="kf-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Terminar nivel"
            onClick={e => e.stopPropagation()}
          >
            <p className="muted small-text">Nivel {level.number} · {DIFFICULTY_LABEL[level.difficulty]}</p>
            <h3>{title}</h3>
            <p className="muted small-text">
              Modo prueba: elige las estrellas. Cuando la cámara esté lista, este paso será automático.
            </p>
            <div className="star-choices">
              {[1, 2, 3].map(n => (
                <button key={n} className="star-choice" onClick={() => finish(n)} aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}>
                  <Stars count={n} />
                </button>
              ))}
            </div>
            <button className="link-btn center" onClick={() => setPlaying(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </>
  );
}

