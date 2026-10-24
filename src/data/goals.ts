import type { Goal } from '../types';

/** Opciones del registro. */
export const GOALS: { id: Goal; label: string }[] = [
  { id: 'move', label: 'Movimiento' },
  { id: 'sleep', label: 'Descanso' },
  { id: 'focus', label: 'Enfoque' },
];
