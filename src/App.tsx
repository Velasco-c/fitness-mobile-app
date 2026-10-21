import { useState, type FC } from 'react';
import { AppProvider } from './context/AppContext';
import { PhoneFrame } from './components/PhoneFrame';
import { TabBar } from './components/TabBar';
import { Toasts, NotificationPanel } from './components/Notifications';
import { Summary } from './screens/Summary';
import { Opal } from './screens/Opal';
import { SelectActivity } from './screens/SelectActivity';
import { Profile } from './screens/Profile';
import type { TabId } from './types';

/** Mapa pantalla → componente. Para añadir una pantalla: créala en /screens y regístrala aquí y en config/navigation.ts */
const SCREENS: Record<TabId, FC<{ onNavigate: (tab: TabId) => void }>> = {
  summary: Summary,
  opal: Opal,
  activity: SelectActivity,
  profile: Profile,
};

function Shell() {
  const [tab, setTab] = useState<TabId>('summary');
  const Screen = SCREENS[tab];

  return (
    <PhoneFrame>
      <div className={`screen screen-${tab}`} key={tab}>
        <Screen onNavigate={setTab} />
      </div>
      <TabBar active={tab} onChange={setTab} />
      <Toasts />
      <NotificationPanel />
    </PhoneFrame>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
