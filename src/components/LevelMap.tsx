import type { Level } from '../types';
import { DIFFICULTY_LABEL } from '../config/labels';
import { Icon } from './Icons';

const ROW = 120;      // altura de cada nivel (px)
const MAP_W = 300;    // ancho de referencia del trazado

/** Posición horizontal (0–1) en zigzag. Cambia 0.22 para más o menos amplitud. */
const xAt = (i: number) => 0.5 + 0.22 * Math.sin(i * 1.2);

const STAR = 'M12 2.8l2.9 6 6.5.9-4.7 4.6 1.1 6.5L12 17.6l-5.8 3.2 1.1-6.5-4.7-4.6 6.5-.9z';

interface StarsProps {
  count: number;
  max?: number;
  small?: boolean;
}

export function Stars({ count, max = 3, small = false }: StarsProps) {
  return (
    <span className={`stars ${small ? 'sm' : ''}`} aria-label={`${count} de ${max} estrellas`}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} className={`star ${i < count ? 'on' : ''}`} viewBox="0 0 24 24" aria-hidden="true">
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
}

interface LevelMapProps {
  levels: Level[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/** Mapa de niveles de una categoría: nodos conectados por un camino. La insignia de color indica la dificultad. */
export function LevelMap({ levels, selectedId, onSelect }: LevelMapProps) {
  const height = levels.length * ROW;
  const path = levels
    .map((_, i) => `${i === 0 ? 'M' : 'L'}${(xAt(i) * MAP_W).toFixed(1)} ${i * ROW + ROW / 2}`)
    .join(' ');

  return (
    <div className="level-map" style={{ height }}>
      <svg className="level-path" viewBox={`0 0 ${MAP_W} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <path d={path} />
      </svg>

      {levels.map((l, i) => (
        <button
          key={l.id}
          className={`level-node ${l.status} ${l.id === selectedId ? 'sel' : ''}`}
          style={{ left: `${xAt(i) * 100}%`, top: i * ROW + ROW / 2 - 36 }}
          onClick={() => onSelect(l.id)}
          aria-pressed={l.id === selectedId}
          aria-label={`Nivel ${l.number}${l.title ? `, ${l.title}` : ''}, ${DIFFICULTY_LABEL[l.difficulty]}`}
        >
          <span className="node-wrap">
            <span className="node-core">
              {l.status === 'locked' && <Icon name="lock" size={30} />}
              {l.status === 'done' && <Icon name="check" size={30} />}
              {l.status === 'current' && <span className="node-num">{l.number}</span>}
            </span>
            <span className={`node-badge diff-${l.difficulty}`} aria-hidden="true" />
          </span>
          <span className="node-name">Nivel {l.number}</span>
          {l.status !== 'locked' && <Stars count={l.stars} small />}
        </button>
      ))}
    </div>
  );
}
