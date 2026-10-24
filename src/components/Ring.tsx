import type { ReactNode } from 'react';

interface RingProps {
  progress: number; // 0 → 1
  size?: number;
  stroke?: number;
  /** Cualquier color CSS, por ejemplo var(--kf-brand). Va en style para que el tema lo resuelva. */
  color: string;
  children?: ReactNode;
}

/** Anillo de progreso circular. */
export function Ring({ progress, size = 150, stroke = 26, color, children }: RingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.min(1, Math.max(0, progress));
  const center = size / 2;

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          style={{ stroke: color }}
          strokeOpacity={0.22}
          strokeWidth={stroke}
        />
        <circle
          className="ring-progress"
          cx={center}
          cy={center}
          r={r}
          fill="none"
          style={{ stroke: color }}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p)}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      {children && <div className="ring-center">{children}</div>}
    </div>
  );
}

const ARC_LENGTH = 345.6;
const ARC_PATH = 'M30 150A110 110 0 0 1 250 150';

interface GaugeProps {
  score: number; // 0 → 100
  label: string;
  /** Sufijo opcional junto al número, por ejemplo «%». */
  unit?: string;
}

/** Arco de puntuación (Opal). */
export function Gauge({ score, label, unit }: GaugeProps) {
  return (
    <div className="gauge">
      <svg viewBox="0 0 280 170" aria-hidden="true">
        <defs>
          <linearGradient id="gauge-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" style={{ stopColor: 'var(--kf-success)' }} />
            <stop offset="1" style={{ stopColor: 'var(--kf-sky)' }} />
          </linearGradient>
        </defs>
        <path d={ARC_PATH} fill="none" style={{ stroke: 'var(--kf-track)' }} strokeWidth={8} strokeLinecap="round" />
        <path
          className="ring-progress"
          d={ARC_PATH}
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={ARC_LENGTH}
          strokeDashoffset={ARC_LENGTH * (1 - score / 100)}
        />
      </svg>
      <div className="gauge-text">
        <span className="gauge-score">{score}{unit && <small className="gauge-unit">{unit}</small>}</span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
}

/** Ilustración de premios: tres anillos concéntricos con los colores de estado de la marca. */
export function AwardRings() {
  return (
    <svg className="award" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="none" style={{ stroke: 'var(--kf-track)' }} strokeWidth={2} />
      <circle cx="60" cy="60" r="46" fill="none" style={{ stroke: 'var(--kf-brand)' }} strokeWidth={10} />
      <circle cx="60" cy="60" r="32" fill="none" style={{ stroke: 'var(--kf-success)' }} strokeWidth={10} />
      <circle cx="60" cy="60" r="18" fill="none" style={{ stroke: 'var(--kf-warning)' }} strokeWidth={10} />
    </svg>
  );
}
