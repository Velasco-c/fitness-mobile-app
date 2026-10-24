import { VISIBLE_TABS } from '../config/navigation';
import type { TabId } from '../types';
import { Icon } from './Icons';

interface TabBarProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

/** Barra inferior flotante. Las pestañas se definen en config/navigation.ts */
export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="tabbar" aria-label="Navegación principal">
      {VISIBLE_TABS.map(t => (
        <button
          key={t.id}
          className={`tab ${active === t.id ? 'on' : ''}`}
          aria-label={t.label}
          aria-current={active === t.id ? 'page' : undefined}
          onClick={() => onChange(t.id)}
        >
          <Icon name={t.icon} size={24} />
        </button>
      ))}
    </nav>
  );
}
