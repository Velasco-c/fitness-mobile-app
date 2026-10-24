import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { WaterData, WaterIntake } from '../types';
import { Icon } from './Icons';
import { Gauge } from './Ring';

interface WaterTrackerProps {
  data: WaterData;
}

/** Forma del vaso: cuerpo ligeramente cónico con fondo redondeado. */
const GLASS = 'M16 10H104Q108 10 108 14L100 150Q99 166 84 166H36Q21 166 20 150L12 14Q12 10 16 10Z';
/** Onda que se desplaza en bucle (30 px de periodo). */
const WAVE = 'M-30 6q15-7 30 0t30 0t30 0t30 0t30 0t30 0t30 0V200H-30Z';

const fmtL = (ml: number) => `${(ml / 1000).toFixed(2).replace(/\.?0+$/, '')} L`;

/**
 * Hidratación: vaso animado, barra de lo que falta, botón grande con gota para
 * confirmar el recordatorio, tomas del día y, al final, el medidor de consumo.
 * Todo viene de water.json.
 */
export function WaterTracker({ data }: WaterTrackerProps) {
  const { notify } = useApp();
  const [intakes, setIntakes] = useState<WaterIntake[]>(data.intakes);
  const [amount, setAmount] = useState(data.glassMl);
  const [confirmed, setConfirmed] = useState(data.confirmedToday);
  const [ripple, setRipple] = useState(0);
  const notified = useRef(false);

  const total = intakes.reduce((sum, i) => sum + i.ml, 0);
  const pct = Math.min(1, total / data.goalMl);
  const percent = Math.round(pct * 100);
  const remainingPct = 100 - percent;
  const remaining = Math.max(0, data.goalMl - total);
  const glasses = Math.round(data.goalMl / data.glassMl);
  const filled = Math.min(glasses, Math.floor(total / data.glassMl));
  const reached = total >= data.goalMl;

  useEffect(() => {
    if (reached && !notified.current) {
      notified.current = true;
      notify({
        title: 'Meta de agua cumplida',
        body: `Llevas ${fmtL(total)} hoy. ¡Muy bien!`,
        tone: 'good',
        icon: 'drop',
      });
    }
    // Solo reacciona al cruce de la meta, no a cada toma.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reached]);

  const add = () => {
    const time = new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
    setIntakes(prev => [...prev, { id: `w-${Date.now()}`, time, ml: amount }]);
  };

  const undo = () => setIntakes(prev => prev.slice(0, -1));

  const confirmReminder = () => {
    setConfirmed(c => c + 1);
    setRipple(r => r + 1);
    notify({
      title: 'Recordatorio confirmado',
      body: `Te avisaremos de nuevo en ${data.reminderHours} horas.`,
      tone: 'good',
      icon: 'drop',
    });
  };

  return (
    <>
      <section className="card water">
        <div className="water-top">
          <div>
            <h3>Hidratación</h3>
            <p className="muted small-text">Meta {fmtL(data.goalMl)} · {glasses} vasos</p>
          </div>
          {reached && (
            <span className="water-badge"><Icon name="star" size={14} /> Meta cumplida</span>
          )}
        </div>

        <div className="water-main">
          <div className="glass-wrap">
            <svg className="glass" viewBox="0 0 120 176" aria-hidden="true">
              <defs>
                <clipPath id="glass-clip">
                  <path d={GLASS} />
                </clipPath>
                <linearGradient id="water-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" style={{ stopColor: 'var(--kf-sky)' }} />
                  <stop offset="1" style={{ stopColor: 'var(--kf-blue)' }} />
                </linearGradient>
              </defs>
              <path d={GLASS} className="glass-body" />
              <g clipPath="url(#glass-clip)">
                <g className="water-level" style={{ transform: `translateY(${(1 - pct) * 150}px)` }}>
                  <path className="wave" d={WAVE} fill="url(#water-grad)" />
                  <rect x="-30" y="6" width="180" height="200" fill="url(#water-grad)" />
                </g>
              </g>
              <path d={GLASS} className="glass-outline" />
            </svg>
          </div>

          <div className="water-info">
            <p className="water-value">
              {fmtL(total)}<small> de {fmtL(data.goalMl)}</small>
            </p>

            <div className="glasses" aria-label={`${filled} de ${glasses} vasos`}>
              {Array.from({ length: glasses }, (_, i) => (
                <span key={i} className={`drop ${i < filled ? 'on' : ''}`}>
                  <Icon name="drop" size={18} />
                </span>
              ))}
            </div>

            <div className="water-actions">
              <button className="water-minus" onClick={undo} disabled={intakes.length === 0} aria-label="Quitar la última toma">
                <Icon name="minus" size={18} />
              </button>
              <button className="water-add" onClick={add}>
                <Icon name="plus" size={16} /> {amount} ml
              </button>
            </div>
          </div>
        </div>

        <div className="amounts" role="radiogroup" aria-label="Cantidad por toma">
          {data.amounts.map(a => (
            <button
              key={a}
              role="radio"
              aria-checked={a === amount}
              className={`amount ${a === amount ? 'on' : ''}`}
              onClick={() => setAmount(a)}
            >
              {a} ml
            </button>
          ))}
        </div>

        <div className="remain">
          <div className="remain-top">
            <span>{reached ? 'Meta cumplida' : `Te faltan ${remaining} ml`}</span>
            <b>{remainingPct}%</b>
          </div>
          <div
            className="remain-track"
            role="progressbar"
            aria-label="Porcentaje que falta para la meta"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={remainingPct}
          >
            <span className={reached ? 'done' : ''} style={{ width: `${remainingPct}%` }} />
          </div>
        </div>

        <button className="remind-btn" onClick={confirmReminder}>
          {ripple > 0 && <span key={`r${ripple}`} className="remind-ripple" aria-hidden="true" />}
          <span key={`i${ripple}`} className={`remind-icon ${ripple > 0 ? 'bounce' : ''}`}>
            <Icon name="drop" size={26} />
          </span>
          <span className="remind-text">
            <b>Confirmar recordatorio</b>
            <small>Confirmados hoy: {confirmed} · cada {data.reminderHours} h</small>
          </span>
        </button>
      </section>

      <section className="card intakes-card">
        <p className="intakes-title">Tomas de hoy</p>
        {intakes.length === 0 ? (
          <p className="muted small-text">Aún no registras agua hoy.</p>
        ) : (
          <ul className="intakes">
            {[...intakes].reverse().slice(0, 4).map(i => (
              <li key={i.id}>
                <Icon name="drop" size={16} />
                <span>{i.time}</span>
                <b>{i.ml} ml</b>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="water-score">
        <Gauge score={percent} unit="%" label="Agua consumida hoy" />
      </div>
    </>
  );
}
