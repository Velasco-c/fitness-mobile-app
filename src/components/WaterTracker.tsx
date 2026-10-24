import { useEffect, useState } from 'react';
import { FEATURES } from '../config/features';
import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';
import {
  dayOf, dayTotal, formatInterval, intervalMinutes, slotsFor, vasoLabel, ymd,
} from '../utils/progress';
import { Icon } from './Icons';
import { Gauge } from './Ring';

/** Forma del vaso: cuerpo ligeramente cónico con fondo redondeado. */
const GLASS = 'M16 10H104Q108 10 108 14L100 150Q99 166 84 166H36Q21 166 20 150L12 14Q12 10 16 10Z';
/** Onda que se desplaza en bucle (30 px de periodo). */
const WAVE = 'M-30 6q15-7 30 0t30 0t30 0t30 0t30 0t30 0t30 0V200H-30Z';

/** Días en los que ya se celebró la meta (para no repetir el aviso al volver a la pestaña). */
const celebrated = new Set<string>();

/**
 * Hidratación en vasos. La meta la elige el niño; cada recordatorio es un vaso.
 * Solo se puede sumar agua después de confirmar un recordatorio que ya sonó,
 * y nunca se pasa de la meta.
 */
export function WaterTracker() {
  const { notify } = useApp();
  const { now, state, water, demoReminder, confirmReminder, logWater, undoWater } = useProgress();
  const [amount, setAmount] = useState<number>(water.amounts[0]);
  const [sheet, setSheet] = useState(false);
  const [ripple, setRipple] = useState(0);

  const date = ymd(now);
  const day = dayOf(state, date);
  const goal = state.goal;
  const total = dayTotal(day);
  const pct = Math.min(1, total / goal);
  const percent = Math.round(pct * 100);
  const remaining = Math.max(0, goal - total);
  const reached = total >= goal;

  const slots = slotsFor(water, state, date, now);
  const due = slots.find(s => s.state === 'due');
  const confirmed = slots.find(s => s.state === 'confirmed');
  const next = slots.find(s => s.state === 'waiting');
  const every = formatInterval(intervalMinutes(water, goal));

  const canConfirm = !!due && !reached;
  const canLog = !!confirmed && !reached && amount <= remaining;

  const hint = reached ? 'Meta lista, ¡muy bien!'
    : confirmed ? 'Confirmado. Ahora suma tu vaso'
      : due ? '¡Ya toca! Toca para confirmar'
        : next ? `Siguiente a las ${next.time}`
          : 'Hoy ya no quedan recordatorios';

  useEffect(() => {
    if (reached && !celebrated.has(date)) {
      celebrated.add(date);
      notify({
        title: 'Meta de agua cumplida',
        body: `Tomaste ${total} ${total === 1 ? 'vaso' : 'vasos'} hoy. ¡Muy bien!`,
        tone: 'good',
        icon: 'drop',
      });
    }
    // Solo reacciona al cruce de la meta, no a cada toma.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reached]);

  const onConfirm = () => {
    if (!canConfirm) return;
    setRipple(r => r + 1);
    confirmReminder();
    notify({ title: 'Recordatorio confirmado', body: 'Ahora suma tu vaso.', tone: 'good', icon: 'drop' });
  };

  return (
    <>
      <section className="card water">
        <div className="water-top">
          <div>
            <h3>Hidratación</h3>
            <p className="muted small-text">
              Meta {goal} vasos · cada {every}{' '}
              <button className="link-btn" onClick={() => setSheet(true)}>Cambiar</button>
            </p>
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
              {total}<small> de {goal} vasos</small>
            </p>

            <div className="glasses" aria-label={`${total} de ${goal} vasos`}>
              {Array.from({ length: goal }, (_, i) => (
                <span key={i} className={`drop ${i < total ? 'on' : ''}`}>
                  <Icon name="drop" size={18} />
                </span>
              ))}
            </div>

            <div className="water-actions">
              <button
                className="water-minus"
                onClick={undoWater}
                disabled={day.logs.length === 0}
                aria-label="Quitar el último vaso"
              >
                <Icon name="minus" size={18} />
              </button>
              <button className="water-add" onClick={() => logWater(amount)} disabled={!canLog}>
                <Icon name="plus" size={16} /> {vasoLabel(amount)}
              </button>
            </div>
            {!confirmed && !reached && (
              <small className="water-lock">Confirma un recordatorio para sumar vasos.</small>
            )}
          </div>
        </div>

        <div className="amounts" role="radiogroup" aria-label="Cuántos vasos tomaste">
          {water.amounts.map(a => (
            <button
              key={a}
              role="radio"
              aria-checked={a === amount}
              disabled={a > remaining}
              className={`amount ${a === amount ? 'on' : ''}`}
              onClick={() => setAmount(a)}
            >
              {vasoLabel(a)}
            </button>
          ))}
        </div>

        <div className="remain">
          <div className="remain-top">
            <span>{reached ? 'Meta cumplida' : `Te faltan ${remaining} ${remaining === 1 ? 'vaso' : 'vasos'}`}</span>
            <b>{percent}%</b>
          </div>
          <div
            className="remain-track"
            role="progressbar"
            aria-label="Porcentaje de la meta cumplido"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <span className={reached ? 'done' : ''} style={{ width: `${percent}%` }} />
          </div>
        </div>

        <button
          className={`remind-btn ${canConfirm ? 'due' : ''}`}
          onClick={onConfirm}
          disabled={!canConfirm}
        >
          {ripple > 0 && <span key={`r${ripple}`} className="remind-ripple" aria-hidden="true" />}
          <span key={`i${ripple}`} className={`remind-icon ${ripple > 0 ? 'bounce' : ''}`}>
            <Icon name="drop" size={26} />
          </span>
          <span className="remind-text">
            <b>Confirmar recordatorio</b>
            <small>{hint}</small>
          </span>
        </button>
      </section>

      <section className="card intakes-card">
        <p className="intakes-title">Tomas de hoy</p>
        {day.logs.length === 0 ? (
          <p className="muted small-text">Aún no registras agua hoy.</p>
        ) : (
          <ul className="intakes">
            {[...day.logs].reverse().slice(0, 4).map(l => (
              <li key={l.id}>
                <Icon name="drop" size={16} />
                <span>{l.time}</span>
                <b>{vasoLabel(l.glasses)}</b>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="water-score">
        <Gauge score={percent} unit="%" label="Agua consumida hoy" />
      </div>

      {sheet && <GoalSheet onClose={() => setSheet(false)} />}
    </>
  );
}

interface GoalSheetProps {
  onClose: () => void;
}

/** Hoja para elegir cuántos vasos toma el niño al día. Sugiere cada cuánto sonará el recordatorio. */
function GoalSheet({ onClose }: GoalSheetProps) {
  const { water, state, setGoal, forceReminder, demoReminder } = useProgress();
  const [draft, setDraft] = useState(state.goal);
  const every = formatInterval(intervalMinutes(water, draft));
  const liters = (draft * 0.25).toFixed(1).replace(/\.0$/, '');

  const save = () => {
    setGoal(draft);
    onClose();
  };

  return (
    <div className="kf-sheet-layer" onClick={onClose}>
      <div
        className="kf-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Meta de agua"
        onClick={e => e.stopPropagation()}
      >
        <h3>¿Cuántos vasos tomas al día?</h3>
        <p className="muted small-text">1 vaso = un vaso normal de agua.</p>

        <div className="goal-step">
          <button
            onClick={() => setDraft(d => Math.max(water.goalMin, d - 1))}
            disabled={draft <= water.goalMin}
            aria-label="Quitar un vaso"
          >
            <Icon name="minus" size={20} />
          </button>
          <p><b>{draft}</b> vasos</p>
          <button
            onClick={() => setDraft(d => Math.min(water.goalMax, d + 1))}
            disabled={draft >= water.goalMax}
            aria-label="Añadir un vaso"
          >
            <Icon name="plus" size={20} />
          </button>
        </div>

        <div className="goal-drops" aria-hidden="true">
          {Array.from({ length: draft }, (_, i) => <Icon key={i} name="drop" size={18} />)}
        </div>

        <p className="goal-plan">
          Te avisaré cada <b>{every}</b>, de {water.wake} a {water.sleep} (unos {liters} litros).
          Sugerido: {water.suggestedGlasses} vasos.
        </p>

        <button className="btn-primary" onClick={save}>Guardar meta</button>

        {demoReminder && FEATURES.demoReminder && (
          <button
            className="link-btn center"
            onClick={() => { forceReminder(); onClose(); }}
          >
            Probar recordatorio
          </button>
        )}
      </div>
    </div>
  );
}
