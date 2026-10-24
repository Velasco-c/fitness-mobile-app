import type { IconName } from '../components/Icons';
import type { TabId } from '../types';

/** Pestañas de la barra inferior (orden = orden visual). Cada icono describe su sección. */
export const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'summary', label: 'Inicio', icon: 'home' },
  { id: 'opal', label: 'Hoy', icon: 'drop' },
  { id: 'activity', label: 'Niveles', icon: 'map' },
  { id: 'profile', label: 'Perfil', icon: 'user' },
];
