/** Pestañas de la barra inferior. */
export type TabId = 'summary' | 'opal' | 'activity' | 'profile';

export type Tone = 'good' | 'bad' | 'warn';

export type Goal = 'move' | 'sleep' | 'focus';

/** online: sesión iniciada. offline: modo sin conexión (datos guardados). */
export type Session = 'online' | 'offline';

export type NotificationIcon = 'bell' | 'trophy' | 'drop' | 'gift' | 'camera' | 'star';

/** Color del avatar. Cada valor tiene una clase tone-* en profile.css. */
export type AvatarTone = 'sky' | 'indigo' | 'teal' | 'red' | 'pink' | 'green' | 'gray' | 'navy';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  tone?: Tone;
  icon?: NotificationIcon;
}

/** Usuario en sesión (sin contraseña). */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  goal: Goal;
  avatar: string;
}

/** Hidratación: meta, tamaño de vaso y tomas de hoy (water.json). */
export interface WaterIntake {
  id: string;
  time: string;
  ml: number;
}

export interface WaterData {
  goalMl: number;
  glassMl: number;
  amounts: number[];
  reminderHours: number;
  /** Recordatorios que el usuario ya confirmó hoy. */
  confirmedToday: number;
  intakes: WaterIntake[];
}

export type LevelStatus = 'done' | 'current' | 'locked';
export type Difficulty = 1 | 2 | 3;

export interface Level {
  id: string;
  number: number;
  /** Nombre del nivel; null mientras no esté definido. */
  title: string | null;
  /** Patrón de movimiento (clave del JSON de movimientos). */
  pattern: string | null;
  difficulty: Difficulty;
  stars: 0 | 1 | 2 | 3;
  status: LevelStatus;
}

export interface LevelsData {
  world: string;
  stars: number;
  maxStars: number;
  xp: number;
  xpNext: number;
  movementSource: string;
  levels: Level[];
}

export interface SummaryData {
  /** niveles completados hoy y meta diaria */
  levelsToday: number;
  goal: number;
  completedLevels: number;
  trainings: number;
  starsThisWeek: number;
  weekly: { day: string; value: number }[];
}

export interface Achievement {
  id: string;
  title: string;
  detail: string;
  tone: AvatarTone;
  unlocked: boolean;
}

export interface ProfileData {
  photo: string;
  stars: number;
  streak: number;
  /** Días con actividad, como desplazamiento respecto a hoy (0 = hoy). */
  activeDays: number[];
  achievements: Achievement[];
  avatars: { id: string; tone: AvatarTone }[];
}
