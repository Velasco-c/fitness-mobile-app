import type { IconName } from '../components/Icons';
import type { TabId } from '../types';
import { FEATURES, type FeatureKey } from './features';

interface TabConfig {
  id: TabId;
  label: string;
  icon: IconName;
  /** Si se indica, la pestaña solo aparece con esa función activa en features.ts. */
  feature?: FeatureKey;
}

/** Pestañas de la barra inferior (orden = orden visual). Cada icono describe su sección. */
export const TABS: TabConfig[] = [
  { id: 'summary', label: 'Inicio', icon: 'home' },
  { id: 'opal', label: 'Hoy', icon: 'drop' },
  { id: 'activity', label: 'Niveles', icon: 'map' },
  { id: 'profile', label: 'Perfil', icon: 'user', feature: 'profile' },
];

/** Pestañas visibles según features.ts. */
export const VISIBLE_TABS = TABS.filter(t => !t.feature || FEATURES[t.feature]);
