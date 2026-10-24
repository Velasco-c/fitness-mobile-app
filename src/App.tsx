import { useCallback, useEffect, useState, type FC } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { PhoneFrame } from './components/PhoneFrame';
import { TabBar } from './components/TabBar';
import { Intro } from './components/Intro';
import { Welcome } from './components/Welcome';
import { Toasts, NotificationPanel } from './components/Notifications';
import { Login } from './screens/Login';
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
  const { user, sessionKey } = useApp();
  const [tab, setTab] = useState<TabId>('summary');
  const [intro, setIntro] = useState(true);
  const [welcomedKey, setWelcomedKey] = useState<string | null>(null);
  const finishIntro = useCallback(() => setIntro(false), []);
  const finishWelcome = useCallback(() => setWelcomedKey(sessionKey), [sessionKey]);

  // Al cerrar sesión, la siguiente entrada empieza en el inicio.
  useEffect(() => {
    if (!user) setTab('summary');
  }, [user]);

  if (!user) {
    return (
      <PhoneFrame>
        {intro && <Intro onDone={finishIntro} />}
        <div className="screen screen-login">
          <Login />
        </div>
      </PhoneFrame>
    );
  }

  const Screen = SCREENS[tab];
  // La bienvenida aparece una vez por inicio de sesión (cuenta u offline).
  const welcoming = sessionKey !== null && welcomedKey !== sessionKey;

  return (
    <PhoneFrame>
      <div className={`screen screen-${tab}`} key={tab}>
        <Screen onNavigate={setTab} />
      </div>
      <TabBar active={tab} onChange={setTab} />
      <Toasts />
      <NotificationPanel />
      {welcoming && <Welcome name={user.name} onDone={finishWelcome} />}
    </PhoneFrame>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Shell />
      </AppProvider>
    </ThemeProvider>
  );
}
