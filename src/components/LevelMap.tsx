import type { ReactNode } from 'react';
import type { Level, LevelKind } from '../data/levels';

const ROW = 120;      // altura de cada nivel (px)
const NODE = 72;      // diámetro del nodo (px)
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

const KIND_ICONS: Record<LevelKind | 'lock', ReactNode> = {
  run: <path d="M3 12h4l2-5 4 10 2-5h6" />,
  walk: <path d="M12 3v10M8 21l4-8 4 8" />,
  bike: (
    <>
      <circle cx="6" cy="16" r="3.5" />
      <circle cx="18" cy="16" r="3.5" />
      <path d="M6 16l4-7h6l2 7M10 9l2 7" />
    </>
  ),
  yoga: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M6 20l6-9 6 9M5 12h14" />
    </>
  ),
  hiit: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  swim: (
    <>
      <path d="M2 17c2 0 2-1.5 4-1.5S8 17 10 17s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" />
      <circle cx="14" cy="7" r="2" />
      <path d="M6 12l4-2 3 2" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
};

interface LevelMapProps {
  levels: Level[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/** Mapa de niveles: nodos conectados por un camino, estilo selector de niveles de juego. */
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

      {levels.map((l, i) => {
        const locked = l.status === 'locked';
        return (
          <button
            key={l.id}
            className={`level-node ${l.status} ${l.id === selectedId ? 'sel' : ''}`}
            style={{ left: `${xAt(i) * 100}%`, top: i * ROW + ROW / 2 - NODE / 2 }}
            onClick={() => onSelect(l.id)}
            aria-pressed={l.id === selectedId}
          >
            <span className="node-core">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {KIND_ICONS[locked ? 'lock' : l.kind]}
              </svg>
            </span>
            <span className="node-name">{l.name}</span>
            {!locked && <Stars count={l.stars} small />}
          </button>
        );
      })}
    </div>
  );
}