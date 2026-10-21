import type { LiveSource, PostSource } from '../types';

/** Pantalla Activity: actividades y fuentes de frecuencia cardíaca. */
export const ACTIVITIES = {
  suggested: 'Indoor running',
  all: ['Running', 'Walking', 'Cycling', 'Yoga', 'HIIT', 'Swimming'],
};

export const LIVE_SOURCES: LiveSource[] = [
  { id: 'health', name: 'Apple Health', status: 'Connected', hr: 91 },
  { id: 'fr165', name: 'Forerunner 165', status: 'Available' },
];

export const POST_SOURCES: PostSource[] = [
  { id: 'oura', name: 'Oura Ring 4', battery: 65, status: 'Connected' },
];
