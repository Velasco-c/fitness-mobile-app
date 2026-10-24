import type { AvatarTone, WaterConfig } from '../types';

/* ==========================================================
   PROGRESO: hidratación, recordatorios, niveles y racha.
   Funciones puras: no tocan el DOM ni localStorage (eso está en ProgressContext).
   Cada acción devuelve un estado nuevo.
   ========================================================== */

/** waiting: aún no llega · due: ya suena · confirmed: confirmado, falta registrar · logged: ya registrado */
export type SlotState = 'waiting' | 'due' | 'confirmed' | 'logged';

export interface Slot {
  index: number;
  /** Identificador estable del recordatorio: fecha + número. */
  id: string;
  /** Hora del recordatorio (HH:MM). */
  time: string;
  state: SlotState;
}

export interface WaterLog {
  id: string;
  /** Hora de la toma (HH:MM). */
  time: string;
  /** Cantidad en vasos. */
  glasses: number;
  /** Recordatorio que usó esta toma. */
  slot: number;
}

export interface WaterDay {
  /** Estado de cada recordatorio del día, por número. */
  slots: Record<string, 'confirmed' | 'logged'>;
  logs: WaterLog[];
}

export interface LevelRecord {
  /** Clave del nivel (ver levelKey). */
  key: string;
  /** Estrellas de esa vez. */
  stars: number;
  /** Fecha (YYYY-MM-DD). */
  date: string;
}

export interface ProgressState {
  /** Meta del día en vasos. */
  goal: number;
  /** Agua por fecha (YYYY-MM-DD). */
  days: Record<string, WaterDay>;
  /** Recordatorios que se fuerzan a «ya suena» (solo para pruebas). */
  forced: string[];
  /** Historial de niveles jugados. */
  levels: LevelRecord[];
  /** Fechas con actividad (nivel terminado o meta de agua cumplida). Base de la racha. */
  activeDays: string[];
  /** Fechas en que se cumplió la meta de agua. */
  goalDays: string[];
  /** Avatar ilustrado elegido (id de profile.json). null si usa foto propia o solo color. */
  avatar: string | null;
  /** Foto propia (data URL), si la subió. */
  photo: string | null;
  /** Color de fondo del avatar. */
  tone: AvatarTone;
  /** Logros ya desbloqueados: id → fecha. Una vez desbloqueado, se queda. */
  unlocked: Record<string, string>;
}

const STORAGE_KEY = 'kidfit.progress.v1';
const KEEP_WATER_DAYS = 14;

const pad = (n: number) => String(n).padStart(2, '0');
const EMPTY_DAY: WaterDay = { slots: {}, logs: [] };

/* ---------- Fechas y horas ---------- */

export const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return ymd(new Date(y, m - 1, d + n));
}

/** Fechas desde hace n-1 días hasta hoy (incluida), en orden. */
export function lastDays(today: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => addDays(today, i - (n - 1)));
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const fromMin = (min: number) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
const clock = (d: Date) => fromMin(d.getHours() * 60 + d.getMinutes());

/** Letra del día de la semana (L, M, X, J, V, S, D) para la gráfica. */
export function dayLabel(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const short = new Date(y, m - 1, d).toLocaleDateString('es-GT', { weekday: 'short' }).replace('.', '');
  return short.charAt(0).toUpperCase();
}

/* ---------- Textos para niños y padres ---------- */

/** «1 vaso», «2 vasos», «½ vaso». */
export function vasoLabel(n: number): string {
  if (n === 0.5) return '½ vaso';
  return n === 1 ? '1 vaso' : `${n} vasos`;
}

/** Minutos a texto: «1 h 35 min», «2 horas», «45 min». */
export function formatInterval(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h} h ${m} min`;
  if (h) return h === 1 ? '1 hora' : `${h} horas`;
  return `${m} min`;
}

/* ---------- Recordatorios ---------- */

/**
 * Cada recordatorio equivale a un vaso: se reparten `goal` recordatorios entre
 * la hora de despertar y la de dormir, redondeando hacia abajo a 5 min para
 * que el último caiga antes de dormir.
 */
export function intervalMinutes(cfg: WaterConfig, goal: number): number {
  const window = toMin(cfg.sleep) - toMin(cfg.wake);
  return Math.max(5, Math.floor(window / Math.max(1, goal) / 5) * 5);
}

const dayOf = (s: ProgressState, date: string): WaterDay => s.days[date] ?? EMPTY_DAY;

export const dayTotal = (day: WaterDay) => day.logs.reduce((sum, l) => sum + l.glasses, 0);

/** Los recordatorios del día con su estado en `now`. */
export function slotsFor(cfg: WaterConfig, s: ProgressState, date: string, now: Date): Slot[] {
  const day = dayOf(s, date);
  const every = intervalMinutes(cfg, s.goal);
  const start = toMin(cfg.wake);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return Array.from({ length: s.goal }, (_, k) => {
    const minute = start + (k + 1) * every;
    const id = `${date}#${k}`;
    const saved = day.slots[k];
    let st: SlotState;
    if (saved === 'logged') st = 'logged';
    else if (saved === 'confirmed') st = 'confirmed';
    else if (nowMin >= minute || s.forced.includes(id)) st = 'due';
    else st = 'waiting';
    return { index: k, id, time: fromMin(minute), state: st };
  });
}

/* ---------- Acciones (devuelven un estado nuevo) ---------- */

const withDay = (s: ProgressState, date: string, day: WaterDay): ProgressState =>
  ({ ...s, days: { ...s.days, [date]: day } });

const markActive = (s: ProgressState, date: string): ProgressState =>
  s.activeDays.includes(date) ? s : { ...s, activeDays: [...s.activeDays, date] };

const markGoalDay = (s: ProgressState, date: string): ProgressState => {
  const active = markActive(s, date);
  return active.goalDays.includes(date) ? active : { ...active, goalDays: [...active.goalDays, date] };
};

/** Qué muestra el círculo del perfil: una ilustración, una foto propia o solo el color. */
export type PictureChoice =
  | { kind: 'art'; id: string; tone: AvatarTone }
  | { kind: 'photo'; url: string }
  | { kind: 'none' };

/** Cambia la imagen del perfil. Elegir una ilustración también pone su color de fondo. */
export function setPicture(s: ProgressState, pic: PictureChoice): ProgressState {
  if (pic.kind === 'art') return { ...s, avatar: pic.id, tone: pic.tone };
  if (pic.kind === 'photo') return { ...s, avatar: null, photo: pic.url };
  return { ...s, avatar: null, photo: null };
}

/** Cambia solo el color de fondo. */
export function setTone(s: ProgressState, tone: AvatarTone): ProgressState {
  return { ...s, tone };
}

/** Confirma el recordatorio que ya suena (el más antiguo). Solo si falta agua. */
export function confirmSlot(cfg: WaterConfig, s: ProgressState, date: string, now: Date): ProgressState {
  const day = dayOf(s, date);
  if (dayTotal(day) >= s.goal) return s;
  const due = slotsFor(cfg, s, date, now).find(x => x.state === 'due');
  if (!due) return s;
  return withDay(s, date, { ...day, slots: { ...day.slots, [due.index]: 'confirmed' } });
}

/**
 * Registra una toma. Solo se puede si hay un recordatorio confirmado sin usar
 * y si la toma no pasa de la meta.
 */
export function logGlasses(cfg: WaterConfig, s: ProgressState, date: string, now: Date, glasses: number): ProgressState {
  const day = dayOf(s, date);
  const total = dayTotal(day);
  const slot = slotsFor(cfg, s, date, now).find(x => x.state === 'confirmed');
  if (!slot || glasses <= 0 || total + glasses > s.goal) return s;
  const log: WaterLog = { id: `w-${now.getTime()}`, time: clock(now), glasses, slot: slot.index };
  let next = withDay(s, date, {
    slots: { ...day.slots, [slot.index]: 'logged' },
    logs: [...day.logs, log],
  });
  if (total + glasses >= s.goal) next = markGoalDay(next, date);
  return next;
}

/** Quita la última toma del día y devuelve su recordatorio a «confirmado». */
export function undoLastLog(s: ProgressState, date: string): ProgressState {
  const day = dayOf(s, date);
  const last = day.logs[day.logs.length - 1];
  if (!last) return s;
  return withDay(s, date, {
    slots: { ...day.slots, [last.slot]: 'confirmed' },
    logs: day.logs.slice(0, -1),
  });
}

/** Cambia la meta, dentro de los límites de water.json. */
export function changeGoal(cfg: WaterConfig, s: ProgressState, goal: number): ProgressState {
  const g = Math.min(cfg.goalMax, Math.max(cfg.goalMin, Math.round(goal)));
  return { ...s, goal: g };
}

/** Hace que el siguiente recordatorio pendiente suene ya (solo para pruebas). */
export function forceNext(cfg: WaterConfig, s: ProgressState, date: string, now: Date): ProgressState {
  const next = slotsFor(cfg, s, date, now).find(x => x.state === 'waiting');
  return next ? { ...s, forced: [...s.forced, next.id] } : s;
}

/** Guarda un nivel terminado (estrellas 1 a 3). */
export function finishLevel(s: ProgressState, key: string, stars: number, date: string): ProgressState {
  const rec: LevelRecord = { key, stars, date };
  return markActive({ ...s, levels: [...s.levels, rec] }, date);
}

/* ---------- Lecturas ---------- */

/** Mejores estrellas de cada nivel jugado. */
export function levelBestStars(s: ProgressState): Record<string, number> {
  const best: Record<string, number> = {};
  for (const r of s.levels) best[r.key] = Math.max(best[r.key] ?? 0, r.stars);
  return best;
}

export const levelsOn = (s: ProgressState, date: string) => s.levels.filter(r => r.date === date).length;

/** Estrellas ganadas cada día de los últimos 7 días. */
export function weekStars(s: ProgressState, today: string): { date: string; stars: number }[] {
  return lastDays(today, 7).map(date => ({
    date,
    stars: s.levels.filter(r => r.date === date).reduce((sum, r) => sum + r.stars, 0),
  }));
}

/** Días distintos con al menos un nivel jugado en los últimos 7 días. */
export function trainingsLastWeek(s: ProgressState, today: string): number {
  const week = new Set(lastDays(today, 7));
  return new Set(s.levels.filter(r => week.has(r.date)).map(r => r.date)).size;
}

/** Racha: días seguidos con actividad, contando hacia atrás desde hoy (o desde ayer si hoy aún no tiene). */
export function streakOf(s: ProgressState, today: string): number {
  const active = new Set(s.activeDays);
  let d = active.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (active.has(d)) {
    n += 1;
    d = addDays(d, -1);
  }
  return n;
}

/** ¿Hubo actividad en el día con ese desplazamiento respecto a hoy? */
export const isActiveOffset = (s: ProgressState, today: string, offset: number) =>
  s.activeDays.includes(addDays(today, offset));

/** Quita del agua los días viejos y los recordatorios forzados de días pasados. */
export function prune(s: ProgressState, today: string): ProgressState {
  const keep = new Set(lastDays(today, KEEP_WATER_DAYS));
  const days = Object.fromEntries(Object.entries(s.days).filter(([d]) => keep.has(d)));
  return { ...s, days, forced: s.forced.filter(id => id.startsWith(today)) };
}

/** Estado de partida la primera vez: meta, niveles, días de actividad y avatar de profile.json. */
export function initialState(
  cfg: WaterConfig,
  seedStars: { key: string; stars: number }[],
  seedOffsets: number[],
  now: Date,
  defaults: { avatar: string; tone: AvatarTone },
): ProgressState {
  const today = ymd(now);
  return {
    goal: cfg.goalGlasses,
    days: {},
    forced: [],
    levels: seedStars.map(x => ({ key: x.key, stars: x.stars, date: today })),
    activeDays: seedOffsets.map(o => addDays(today, o)),
    goalDays: [],
    avatar: defaults.avatar,
    photo: null,
    tone: defaults.tone,
    unlocked: {},
  };
}

/* ---------- Guardado ---------- */

function isProgressState(v: unknown): v is ProgressState {
  const s = v as ProgressState;
  return !!s && typeof s.goal === 'number' && typeof s.days === 'object' && Array.isArray(s.forced)
    && Array.isArray(s.levels) && Array.isArray(s.activeDays);
}

export function readStored(): ProgressState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isProgressState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStored(s: ProgressState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // Sin almacenamiento (modo privado, cuota llena): la sesión sigue funcionando.
  }
}

export { dayOf };
