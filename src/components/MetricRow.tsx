import type { Metric } from '../types';

/** Fila de métrica con barra de segmentos o escala con marca AVG (Opal). */
export function MetricRow({ m }: { m: Metric }) {
  const pos = m.pos ?? 50;
  return (
    <div className={`metric ${m.tone}`}>
      <div className="metric-head">
        <div>
          <span className="metric-name">{m.name}</span>
          {m.value && <span className="metric-value">{m.value}</span>}
        </div>
        <span className="metric-status">{m.status}</span>
      </div>

      {m.kind === 'segments' ? (
        <div className="segments">
          {[1, 2, 3, 4, 5].map(n => (
            <i
              key={n}
              className={`seg ${n <= (m.level ?? 0) ? 'on' : ''}`}
              style={{ animationDelay: `${n * 70}ms` }}
            />
          ))}
        </div>
      ) : (
        <div className="scale">
          <span className="avg">AVG</span>
          <span className="fill" style={{ left: `${Math.min(50, pos)}%`, width: `${Math.abs(pos - 50)}%` }} />
        </div>
      )}
    </div>
  );
}
