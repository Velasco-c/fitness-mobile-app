import type { TabId } from '../types';
import type { IconName } from '../components/Icons';

/** Pestañas de la barra inferior (orden = orden visual) */
export const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'summary', label: 'Summary', icon: 'summary' },
  { id: 'opal', label: 'Opal', icon: 'apps' },
  { id: 'activity', label: 'Activity', icon: 'pulse' },
  { id: 'profile', label: 'Profile', icon: 'profile' },
];
