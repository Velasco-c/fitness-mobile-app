import type { ReactNode } from 'react';

interface RingProps {
  progress: number; // 0 → 1
  size?: number;
  stroke?: number;
  color: string;
  children?: ReactNode;
}

/** Anillo de progreso circular (Activity Ring). */
export function Ring({ progress, size = 150, stroke = 26, color, children }: RingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.min(1, Math.max(0, progress));
  const center = size / 2;

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={r} fill="none" stroke={color} strokeOpacity={0.22} strokeWidth={stroke} />
        <circle
          className="ring-progress"
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color}
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
}

/** Arco de puntuación (Opal). */
export function Gauge({ score, label }: GaugeProps) {
  return (
    <div className="gauge">
      <svg viewBox="0 0 280 170" aria-hidden="true">
        <defs>
          <linearGradient id="gauge-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#c3f7c4" />
            <stop offset="1" stopColor="#8ef0f0" />
          </linearGradient>
        </defs>
        <path d={ARC_PATH} fill="none" stroke="#14201b" strokeWidth={8} strokeLinecap="round" />
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
        <span className="gauge-score">{score}</span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
}

/** Ilustración de premios: anillos concéntricos. */
export function AwardRings() {
  return (
    <svg className="award" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="none" stroke="#e5e5e5" strokeWidth={2} />
      <circle cx="60" cy="60" r="46" fill="none" stroke="#000" strokeWidth={10} />
      <circle cx="60" cy="60" r="32" fill="none" stroke="#000" strokeWidth={10} />
      <circle cx="60" cy="60" r="18" fill="none" stroke="#000" strokeWidth={10} />
    </svg>
  );
}
