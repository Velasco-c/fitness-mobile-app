import type { CSSProperties } from 'react';

interface BarsProps {
  values: number[];
  color: string;
}

/** Gráfico de barras por hora (pasos / distancia). */
export function Bars({ values, color }: BarsProps) {
  const max = Math.max(...values, 1);
  return (
    <div className="bars" style={{ '--bar': color } as CSSProperties}>
      {values.map((v, i) => (
        <i key={i} style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}
