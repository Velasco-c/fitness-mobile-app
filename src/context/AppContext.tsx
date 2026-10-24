import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode,
} from 'react';
import type { AppNotification, Session, UserProfile } from '../types';
import { api } from '../services/api';

export type NewNotification = Omit<AppNotification, 'id' | 'time' | 'read'>;

interface AppContextValue {
  user: UserProfile | null;
  session: Session | null;
  /** Cambia en cada inicio de sesión (sirve para disparar la bienvenida). */
  sessionKey: string | null;
  startSession: (user: UserProfile, session: Session) => void;
  logout: () => void;
  setAvatar: (avatar: string) => void;
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

/** Estado global: sesión, notificaciones (cargadas de JSON), avisos emergentes y panel. */
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const seq = useRef(0);

  useEffect(() => {
    let alive = true;
    api.notifications()
      .then(list => { if (alive) setNotifications(prev => (prev.length > 0 ? prev : list)); })
      .catch(() => undefined);
    return () => { alive = false; };
  }, []);

  const startSession = useCallback((u: UserProfile, s: Session) => {
    setUser(u);
    setSession(s);
    setSessionKey(`${u.id}-${Date.now()}`);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSession(null);
    setSessionKey(null);
    setPanelOpen(false);
    setToasts([]);
  }, []);

  const setAvatar = useCallback((avatar: string) => {
    setUser(prev => (prev ? { ...prev, avatar } : prev));
  }, []);

  const notify = useCallback((n: NewNotification) => {
    seq.current += 1;
    const item: AppNotification = {
      ...n,
      id: `local-${seq.current}`,
      time: new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }),
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
      user, session, sessionKey, startSession, logout, setAvatar,
      notifications, toasts, unread,
      panelOpen, setPanelOpen, notify, markAllRead, dismissToast,
    }),
    [user, session, sessionKey, startSession, logout, setAvatar, notifications, toasts, unread,
      panelOpen, notify, markAllRead, dismissToast],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
