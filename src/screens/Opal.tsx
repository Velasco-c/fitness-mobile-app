import { useState } from 'react';
import { Icon } from '../components/Icons';
import { Gauge } from '../components/Ring';
import { MetricRow } from '../components/MetricRow';
import { OPAL } from '../data/opal';

const formatDay = (offset: number) =>
  offset === 0
    ? 'Today'
    : offset === 1
      ? 'Yesterday'
      : new Date(Date.now() - offset * 86_400_000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export function Opal() {
  const [day, setDay] = useState(0);
  const [catId, setCatId] = useState(OPAL.categories[0].id);
  const cat = OPAL.categories.find(c => c.id === catId) ?? OPAL.categories[0];
  const score = Math.max(0, OPAL.base - day * 5);

  return (
    <div className="screen-scroll">
      <header className="opal-top">
        <button className="circle-btn" onClick={() => setDay(0)} aria-label="Back to today">
          <Icon name="chevron" className="flip" />
        </button>
        <div className="day-nav">
          <button className="chev" onClick={() => setDay(d => d + 1)} aria-label="Previous day">
            <Icon name="chevron" className="flip" size={18} />
          </button>
          <span>{formatDay(day)}</span>
          <button className="chev" onClick={() => setDay(d => d - 1)} disabled={day === 0} aria-label="Next day">
            <Icon name="chevron" size={18} />
          </button>
        </div>
        <span style={{ width: 46 }} />
      </header>

      <Gauge score={score} label="Opal Score" />

      <svg className="connector" viewBox="0 0 300 62" aria-hidden="true">
        <path
          d="M150 2V20M150 20Q150 30 140 30H62Q52 30 52 40V60M150 20Q150 30 160 30H238Q248 30 248 40V60"
          fill="none"
          stroke="#3a4048"
          strokeWidth={2}
        />
      </svg>

      <div className="pills">
        {OPAL.categories.map(c => (
          <button
            key={c.id}
            className={`pill-btn ${c.id === catId ? 'on' : ''}`}
            onClick={() => setCatId(c.id)}
            aria-pressed={c.id === catId}
          >
            <span className="pill">
              <Icon name={c.icon} size={22} />
              <b>{c.score}</b>
            </span>
            <span className="pill-name">{c.name}</span>
          </button>
        ))}
      </div>

      <section className="desc">
        <h2>{cat.title}</h2>
        <p>{cat.text}</p>
      </section>

      <div className="metrics">
        {cat.metrics.map(m => <MetricRow key={m.name} m={m} />)}
      </div>
    </div>
  );
}
