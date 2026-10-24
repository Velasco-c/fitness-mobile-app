/** Pestañas de la barra inferior. */
export type TabId = 'summary' | 'opal' | 'activity' | 'profile';

export type Tone = 'good' | 'bad' | 'warn';

export type Goal = 'move' | 'sleep' | 'focus';

/** online: sesión iniciada. offline: modo sin conexión (datos guardados). */
export type Session = 'online' | 'offline';

export type NotificationIcon = 'bell' | 'trophy' | 'drop' | 'gift' | 'camera' | 'star';

/** Color del avatar. Cada valor tiene una clase tone-* en profile.css. */
export type AvatarTone =
  | 'sky' | 'indigo' | 'teal' | 'red' | 'pink' | 'green' | 'gray' | 'navy'
  | 'orange' | 'yellow' | 'royal';

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

/** Hidratación: configuración de water.json. Las tomas y recordatorios de cada día se guardan aparte (utils/progress.ts). */
export interface WaterConfig {
  /** Meta inicial en vasos. */
  goalGlasses: number;
  goalMin: number;
  goalMax: number;
  suggestedGlasses: number;
  /** Hora de despertar y de dormir (HH:MM): entre ellas se reparten los recordatorios. */
  wake: string;
  sleep: string;
  /** Tamaños de toma que puede elegir el niño, en vasos. */
  amounts: number[];
}

/* ---------- Niveles ----------
 * levels.json solo guarda lo que se edita: categorías y, dentro de cada una,
 * los niveles. El número, el estado y los totales se calculan en utils/levels.ts.
 */

export type Difficulty = 1 | 2 | 3;
export type LevelStars = 0 | 1 | 2 | 3;
export type LevelStatus = 'done' | 'current' | 'locked';

/** Color de la tarjeta de categoría. Cada valor tiene una clase tone-* en levels.css. */
export type CategoryTone = 'blue' | 'green' | 'orange' | 'teal' | 'pink' | 'indigo' | 'slate';

/** Nivel tal como está en levels.json. */
export interface LevelEntry {
  /** Nombre del nivel; null mientras no esté definido («Por definir»). */
  title: string | null;
  /** Clave del patrón de movimiento; null si aún no tiene. */
  pattern: string | null;
  difficulty: Difficulty;
  /** Estrellas ganadas. Un nivel con estrellas está completado. */
  stars: LevelStars;
}

/** Categoría tal como está en levels.json. */
export interface CategoryEntry {
  id: string;
  name: string;
  /** Texto pequeño de la categoría, p. ej. «Mundo 1». */
  subtitle: string;
  tone: CategoryTone;
  levels: LevelEntry[];
}

/** Contenido de levels.json. */
export interface LevelsData {
  /** Cómo se juega el nivel, p. ej. «Cámara frontal». */
  movementSource: string;
  categories: CategoryEntry[];
}

/** Nivel con número y estado calculados. */
export interface Level extends LevelEntry {
  id: string;
  number: number;
  status: LevelStatus;
}

/** Categoría lista para la UI, con progreso calculado. */
export interface Category extends Omit<CategoryEntry, 'levels'> {
  levels: Level[];
  done: number;
  stars: number;
  maxStars: number;
}

/** Totales de todas las categorías. next es el primer nivel actual que falta. */
export interface LevelTotals {
  categories: number;
  levels: number;
  done: number;
  stars: number;
  maxStars: number;
  next: { category: Category; level: Level } | null;
}

export interface SummaryData {
  /** Meta diaria de niveles. Lo demás sale del progreso guardado. */
  goal: number;
}

/** Regla que desbloquea un logro. El valor se calcula del progreso del niño. */
export type AchievementRule =
  | { type: 'levelsDone'; count: number }
  | { type: 'stars'; count: number }
  | { type: 'streak'; count: number }
  | { type: 'waterGoalDays'; count: number }
  | { type: 'categoriesDone'; count: number };

/** Logro tal como está en achievements.json. */
export interface AchievementDef {
  id: string;
  title: string;
  /** Cómo se gana, en una frase. */
  detail: string;
  tone: AvatarTone;
  rule: AchievementRule;
}

/** Avatar ilustrado de profile.json: imagen y color de fondo. */
export interface AvatarArt {
  id: string;
  /** Ruta de la imagen (recortada en círculo, con transparencia). */
  src: string;
  tone: AvatarTone;
}

export interface ProfileData {
  /** Avatar y color de partida, antes de que el niño elija. */
  defaultAvatar: string;
  defaultTone: AvatarTone;
  /** Días de actividad de partida (desplazamiento respecto a hoy). Solo siembran el progreso la primera vez. */
  seedActiveDays: number[];
  avatars: AvatarArt[];
}
