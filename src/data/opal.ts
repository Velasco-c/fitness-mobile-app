import type { OpalCategory } from '../types';

/** Datos de la pantalla Hoy. */
export const OPAL: { base: number; categories: OpalCategory[] } = {
  base: 97,
  categories: [
    {
      id: 'sleep',
      name: 'Sueño',
      icon: 'moon',
      score: 100,
      title: 'Sueño',
      text: 'Qué tan bien descansaste antes, durante y después de dormir.',
      metrics: [
        { name: 'Duración', value: '0 min', status: 'Poco', tone: 'bad', kind: 'segments', level: 1 },
        { name: 'Primera actividad', value: '11:32 a. m.', status: 'Bien', tone: 'good', kind: 'scale', pos: 72 },
        { name: 'Pantallas en la cama', status: 'Bien', tone: 'good', kind: 'segments', level: 4 },
        { name: 'Pantalla de noche', status: 'Excelente', tone: 'good', kind: 'segments', level: 5 },
      ],
    },
    {
      id: 'focus',
      name: 'Enfoque',
      icon: 'hourglass',
      score: 92,
      title: 'Enfoque',
      text: 'Cuánto tiempo estuviste concentrado en tus tareas o estudio, sin distracciones.',
      metrics: [
        { name: 'Tiempo concentrado', value: '3 h 40 min', status: 'Bien', tone: 'good', kind: 'segments', level: 4 },
        { name: 'Distracciones', value: '12', status: 'Bien', tone: 'good', kind: 'scale', pos: 30 },
        { name: 'Cambios de app', value: '18', status: 'Regular', tone: 'warn', kind: 'segments', level: 3 },
      ],
    },
    {
      id: 'rest',
      name: 'Descanso',
      icon: 'cloud',
      score: 100,
      title: 'Descanso',
      text: 'Qué tan bien te recuperaste entre la escuela y la hora de dormir.',
      metrics: [
        { name: 'Pausas', value: '4', status: 'Excelente', tone: 'good', kind: 'segments', level: 5 },
        { name: 'Relajación', value: '45 min', status: 'Bien', tone: 'good', kind: 'scale', pos: 80 },
      ],
    },
  ],
};