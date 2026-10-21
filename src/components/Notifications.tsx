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

/** Panel deslizable con el historial de notificaciones (abre la campana). */
export function NotificationPanel() {
  const { panelOpen, setPanelOpen, notifications, markAllRead, unread } = useApp();
  return (
    <aside className={`sheet notif-sheet ${panelOpen ? 'open' : ''}`} aria-hidden={!panelOpen}>
      <header className="screen-head">
        <h2>Notifications</h2>
        <button className="icon-btn" onClick={() => setPanelOpen(false)} aria-label="Close">
          <Icon name="close" />
        </button>
      </header>
      <div className="notif-actions">
        <span className="muted">{unread} unread</span>
        <button className="link-btn" onClick={markAllRead}>Mark all as read</button>
      </div>
      <ul className="notif-list">
        {notifications.map(n => (
          <li key={n.id} className={`notif ${n.read ? '' : 'unread'} ${n.tone ?? ''}`}>
            <b>{n.title}</b>
            <p>{n.body}</p>
            <small>{n.time}</small>
          </li>
        ))}
      </ul>
    </aside>
  );
}
