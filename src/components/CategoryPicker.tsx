import type { CSSProperties } from 'react';
import type { Category, LevelTotals } from '../types';
import { Icon } from './Icons';

interface CategoryPickerProps {
  name: string;
  categories: Category[];
  totals: LevelTotals;
  onOpen: (id: string) => void;
}

/** Elegir categoría (estilo mision.png): saludo, resumen, tarjetas deslizables y progreso total. */
export function CategoryPicker({ name, categories, totals, onOpen }: CategoryPickerProps) {
  const pct = totals.levels > 0 ? (totals.done / totals.levels) * 100 : 0;

  return (
    <div className="screen-scroll levels-picker">
      <header className="cat-head">
        <p className="hello">Hola {name},</p>
        <h1>Selecciona la categoría</h1>
      </header>

      <section className="cat-stat">
        <span className="cat-stat-icon" aria-hidden="true">
          <Icon name="map" size={28} />
        </span>
        <div>
          <p className="cat-stat-value">
            {totals.done}<small> completados</small>
          </p>
          <p className="muted small-text">De {totals.levels} niveles en {totals.categories} categorías</p>
        </div>
      </section>

      <div className="cat-rail">
        {categories.map(c => (
          <button
            key={c.id}
            className={`cat-card tone-${c.tone}`}
            onClick={() => onOpen(c.id)}
            aria-label={`${c.name}, ${c.done} de ${c.levels.length} niveles completados`}
          >
            <span className="cat-count">{c.done}/{c.levels.length}</span>
            <span className="cat-foot">
              <span className="cat-name">{c.name}</span>
              <span className="cat-sub">{c.subtitle} · {c.levels.length} niveles</span>
            </span>
          </button>
        ))}
      </div>

      <section className="cat-progress">
        <div className="cat-progress-row">
          <Icon name="star" size={22} />
          <span>Progreso total · {Math.round(pct)}%</span>
        </div>
        <div className="xp">
          <div className="xp-fill" style={{ '--p': `${pct}%` } as CSSProperties} />
        </div>
      </section>
    </div>
  );
}
