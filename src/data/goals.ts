import type { Goal } from '../types';

/** Opciones del registro. */
export const GOALS: { id: Goal; label: string }[] = [
  { id: 'move', label: 'Move' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'focus', label: 'Focus' },
];
