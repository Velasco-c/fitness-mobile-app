import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { useApp } from '../context/AppContext';
import type { AppNotification } from '../types';
import { Icon } from './Icons';

const TOAST_MS = 3500;

/** Avisos emergentes arriba del teléfono. Se cierran solos. */
export function Toasts() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map(t => <Toast key={t.id} item={t} onDone={dismissToast} />)}
    </div>
  );
}

function Toast({ item, onDone }: { item: AppNotification; onDone: (id: string) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDone(item.id), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [item.id, onDone]);

  return (
    <div className={`toast ${item.tone ?? ''}`} role="status">
      <b>{item.title}</b>
      <span>{item.body}</span>
    </div>
  );
}

/** Fracción del ancho que hay que deslizar para borrar (como Gmail). */
const SWIPE_TO_DELETE = 0.35;

/** Panel de notificaciones (estilo notificaciones+.png). Desliza una fila a los lados para borrarla. */
export function NotificationPanel() {
  const { panelOpen, setPanelOpen, notifications, markAllRead, removeNotification, unread } = useApp();
  return (
    <aside className={`sheet notif-sheet ${panelOpen ? 'open' : ''}`} aria-hidden={!panelOpen}>
      <header className="notif-head">
        <div className="notif-top">
          <button className="notif-round" onClick={() => setPanelOpen(false)} aria-label="Cerrar">
            <Icon name="chevron" className="flip" size={20} />
          </button>
          <h2>Notificaciones</h2>
          <span className="notif-round notif-round-static" aria-hidden="true">
            <Icon name="bell" size={18} />
          </span>
        </div>
        <div className="notif-meta">
          <span>{unread} sin leer</span>
          <button className="notif-link" onClick={markAllRead}>Marcar todo como leído</button>
        </div>
      </header>

      <h3 className="notif-title">Todas</h3>
      <ul className="notif-list">
        {notifications.map(n => (
          <NotificationRow key={n.id} item={n} onRemove={removeNotification} />
        ))}
        {notifications.length === 0 && <li className="notif-empty">No tienes notificaciones.</li>}
      </ul>
    </aside>
  );
}

interface NotificationRowProps {
  item: AppNotification;
  onRemove: (id: string) => void;
}

/** Una notificación que se borra al deslizarla a los lados; si no llega al umbral, vuelve a su sitio. */
function NotificationRow({ item, onRemove }: NotificationRowProps) {
  const [dx, setDx] = useState(0);
  const [leaving, setLeaving] = useState<0 | 1 | -1>(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ startX: number; width: number; dx: number } | null>(null);

  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (leaving) return;
    const row = e.currentTarget.parentElement;
    drag.current = { startX: e.clientX, width: row?.offsetWidth ?? 320, dx: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    d.dx = e.clientX - d.startX;
    setDx(d.dx);
  };

  const finish = (cancelled: boolean) => {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    if (!d) return;
    if (!cancelled && Math.abs(d.dx) > d.width * SWIPE_TO_DELETE) {
      const dir = d.dx > 0 ? 1 : -1;
      setLeaving(dir);
      window.setTimeout(() => onRemove(item.id), 220);
    } else {
      setDx(0);
    }
  };

  const transform = leaving ? `translateX(${leaving * 110}%)` : `translateX(${dx}px)`;

  return (
    <li className="notif-row">
      <div className="notif-undo" aria-hidden="true" style={{ opacity: Math.min(1, Math.abs(dx) / 60) }}>
        <Icon name="trash" size={22} />
      </div>
      <div
        className={`notif notif-fg ${item.read ? '' : 'unread'} ${dragging ? 'dragging' : ''}`}
        style={{ transform }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => finish(false)}
        onPointerCancel={() => finish(true)}
      >
        <span className={`notif-icon ${item.tone ?? ''}`}>
          <Icon name={item.icon ?? 'bell'} size={20} />
        </span>
        <div className="notif-body">
          <b>{item.title}</b>
          <p>{item.body}</p>
        </div>
        <small>{item.time}</small>
      </div>
    </li>
  );
}
