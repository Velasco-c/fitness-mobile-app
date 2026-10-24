import type {
  AppNotification, LevelsData, ProfileData, SummaryData, UserProfile, WaterData,
} from '../types';

/**
 * Backend simulado. Lee los JSON de public/data/ con una pequeña latencia,
 * como si llegaran de un servidor. Para conectar el backend real, cambia
 * solo este archivo: las pantallas no conocen de dónde vienen los datos.
 */

const DEFAULT_LATENCY_MS = 350;

/** Usuario tal como está en users.json (incluye la contraseña de la simulación). */
interface UserRecord extends UserProfile {
  password: string;
}

const wait = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));

/** Carga data/<name>.json relativo al documento, así funciona en dev y en GitHub Pages. */
export async function fetchJson<T>(name: string, latency = DEFAULT_LATENCY_MS): Promise<T> {
  const res = await fetch(`data/${name}.json`, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`No se pudo cargar «${name}» (${res.status}).`);
  await wait(latency);
  return (await res.json()) as T;
}

function toProfile(u: UserRecord): UserProfile {
  return { id: u.id, name: u.name, email: u.email, goal: u.goal, avatar: u.avatar };
}

async function loadUsers(latency: number): Promise<UserRecord[]> {
  const { users } = await fetchJson<{ users: UserRecord[] }>('users', latency);
  return users;
}

export const api = {
  /** Inicio de sesión: devuelve el usuario o null si el correo o la contraseña no coinciden. */
  async signIn(email: string, password: string): Promise<UserProfile | null> {
    const users = await loadUsers(700);
    const wanted = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === wanted && u.password === password);
    return found ? toProfile(found) : null;
  },

  /** Modo offline: no pide contraseña y usa el último usuario guardado. */
  async offlineUser(): Promise<UserProfile> {
    const users = await loadUsers(150);
    if (users.length === 0) throw new Error('Sin usuario guardado.');
    return toProfile(users[0]);
  },

  summary: () => fetchJson<SummaryData>('summary'),
  levels: () => fetchJson<LevelsData>('levels'),
  profile: () => fetchJson<ProfileData>('profile'),
  water: () => fetchJson<WaterData>('water'),
  notifications: () => fetchJson<AppNotification[]>('notifications', 200),
};
