import type { AppNotification } from '../types';

/** Notificaciones iniciales. Las nuevas se crean desde AppContext.notify(). */
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', title: 'Casi logras tu meta', body: 'Te faltan 204 calorías para cerrar tu anillo.', time: '11:17', read: false, tone: 'good' },
  { id: 'n2', title: 'Poco descanso', body: 'Dormiste poco. Intenta acostarte un poco más temprano.', time: '08:02', read: true, tone: 'bad' },
  { id: 'n3', title: 'Ritmo cardíaco conectado', body: 'Apple Health está enviando tu ritmo cardíaco.', time: '07:40', read: true },
];