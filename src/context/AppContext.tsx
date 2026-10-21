import {
  createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode,
} from 'react';
import type { AppNotification, UserProfile } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data/notifications';

export type NewNotification = Omit<AppNotification, 'id' | 'time' | 'read'>;

interface AppContextValue {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  notifications: AppNotification[];
  toasts: AppNotification[];
  unread: number;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  notify: (n: NewNotification) => void;
  markAllRead: () => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

/** Estado global: usuario, notificaciones, avisos emergentes y panel. */
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const seq = useRef(0);

  const notify = useCallback((n: NewNotification) => {
    seq.current += 1;
    const item: AppNotification = {
      ...n,
      id: `local-${seq.current}`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setNotifications(prev => [item, ...prev]);
    setToasts(prev => [item, ...prev].slice(0, 3));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const value = useMemo<AppContextValue>(
    () => ({
      user, setUser, notifications, toasts, unread,
      panelOpen, setPanelOpen, notify, markAllRead, dismissToast,
    }),
    [user, notifications, toasts, unread, panelOpen, notify, markAllRead, dismissToast],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
