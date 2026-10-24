import { useEffect } from 'react';
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

/** Panel de notificaciones (estilo notificaciones+.png): cabecera celeste y lista con iconos de color. */
export function NotificationPanel() {
  const { panelOpen, setPanelOpen, notifications, markAllRead, unread } = useApp();
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
          <li key={n.id} className={`notif ${n.read ? '' : 'unread'}`}>
            <span className={`notif-icon ${n.tone ?? ''}`}>
              <Icon name={n.icon ?? 'bell'} size={20} />
            </span>
            <div className="notif-body">
              <b>{n.title}</b>
              <p>{n.body}</p>
            </div>
            <small>{n.time}</small>
          </li>
        ))}
      </ul>
    </aside>
  );
}
