export type LevelKind = 'run' | 'walk' | 'bike' | 'yoga' | 'hiit' | 'swim';
export type LevelStatus = 'done' | 'current' | 'locked';

export interface Level {
  id: string;
  name: string;
  kind: LevelKind;
  minutes: number;
  difficulty: 1 | 2 | 3;
  stars: 0 | 1 | 2 | 3;
  status: LevelStatus;
}

export const DIFFICULTY_LABEL: Record<1 | 2 | 3, string> = { 1: 'Fácil', 2: 'Normal', 3: 'Difícil' };

export const LEVELS: Level[] = [
  { id: 'l1', name: 'Caminata de la mañana', kind: 'walk', minutes: 20, difficulty: 1, stars: 3, status: 'done' },
  { id: 'l2', name: 'Estiramiento con yoga', kind: 'yoga', minutes: 30, difficulty: 1, stars: 2, status: 'done' },
  { id: 'l3', name: 'Correr en casa', kind: 'run', minutes: 25, difficulty: 2, stars: 0, status: 'current' },
  { id: 'l4', name: 'Pedaleo en colinas', kind: 'bike', minutes: 45, difficulty: 2, stars: 0, status: 'locked' },
  { id: 'l5', name: 'Ráfaga de energía', kind: 'hiit', minutes: 20, difficulty: 3, stars: 0, status: 'locked' },
  { id: 'l6', name: 'Nado en la piscina', kind: 'swim', minutes: 40, difficulty: 3, stars: 0, status: 'locked' },
];

export const PLAYER = {
  world: 'Mundo 1 · Recuperación',
  stars: 5,
  maxStars: 18,
  xp: 340,
  xpNext: 500,
};