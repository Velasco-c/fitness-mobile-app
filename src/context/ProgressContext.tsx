import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode,
} from 'react';
import { LoadError, Loading } from '../components/LoadState';
import { PhoneFrame } from '../components/PhoneFrame';
import { FEATURES } from '../config/features';
import { api } from '../services/api';
import type { AchievementDef, AvatarTone, LevelsData, ProfileData, WaterConfig } from '../types';
import { achievementViews, type AchievementStats, type AchievementView } from '../utils/achievements';
import { buildCategories, seedLevelStars, summarizeLevels } from '../utils/levels';
import {
  changeGoal, confirmSlot, dayOf, dayTotal, finishLevel, forceNext, initialState, levelBestStars,
  logGlasses, prune, readStored, setPicture as setPictureIn, setTone as setToneIn, slotsFor, streakOf,
  undoLastLog, writeStored, ymd, type PictureChoice, type ProgressState,
} from '../utils/progress';
import { useApp } from './AppContext';

/** Dónde llevar al niño al tocar «Meta de hoy»: categoría y número de nivel. */
export interface Focus {
  categoryId: string;
  number: number;
}

export interface ProgressValue {
  now: Date;
  /** Fecha de hoy (YYYY-MM-DD). */
  date: string;
  water: WaterConfig;
  state: ProgressState;
  /** Mejores estrellas por nivel jugado. */
  bestStars: Record<string, number>;
  focus: Focus | null;
  setFocus: (f: Focus) => void;
  clearFocus: () => void;
  demoReminder: boolean;
  completeLevel: (key: string, stars: number) => void;
  confirmReminder: () => void;
  logWater: (glasses: number) => void;
  undoWater: () => void;
  setGoal: (goal: number) => void;
  forceReminder: () => void;
  /** Ilustración elegida (id de profile.json), o null si usa foto propia o solo color. */
  avatar: string | null;
  /** Foto propia, si la subió. */
  photo: string | null;
  /** Color de fondo del perfil y del avatar. */
  tone: AvatarTone;
  setPicture: (pic: PictureChoice) => void;
  setTone: (tone: AvatarTone) => void;
  /** Logros con su progreso y si ya están desbloqueados. */
  achievements: AchievementView[];
}

interface Loaded {
  water: WaterConfig;
  levels: LevelsData;
  profile: ProfileData;
  achievements: AchievementDef[];
}

const ProgressCtx = createContext<ProgressValue | null>(null);

/**
 * Progreso del niño: hidratación, niveles, racha, logros, avatar y recordatorios.
 * Se guarda en localStorage y avisa de recordatorios y logros nuevos. Los datos de
 * partida salen de water.json, levels.json, profile.json y achievements.json.
 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const { notify } = useApp();
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [state, setState] = useState<ProgressState | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [focus, setFocusState] = useState<Focus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const notified = useRef(new Set<string>());

  // Carga de configuración y del progreso guardado (o estado de partida).
  useEffect(() => {
    let alive = true;
    setError(null);
    Promise.all([api.water(), api.levels(), api.profile(), api.achievements()])
      .then(([water, levels, profile, achievements]) => {
        if (!alive) return;
        const stored = readStored();
        const seeded = initialState(
          water,
          seedLevelStars(levels),
          profile.seedActiveDays,
          new Date(),
          { avatar: profile.defaultAvatar, tone: profile.defaultTone },
        );
        // Lo guardado manda; lo que falte (versiones anteriores) viene de la partida.
        const merged: ProgressState = { ...seeded, ...stored };
        if (stored && stored.tone === undefined && stored.avatar) {
          // Versión anterior: el color era el del avatar elegido.
          merged.tone = profile.avatars.find(a => a.id === stored.avatar)?.tone ?? profile.defaultTone;
        }
        setLoaded({ water, levels, profile, achievements });
        setState(merged);
      })
      .catch((err: unknown) => {
        if (alive) setError(err instanceof Error ? err.message : 'No se pudo cargar el progreso.');
      });
    return () => { alive = false; };
  }, [attempt]);

  // Reloj: revisa recordatorios y racha cada 30 s.
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(id);
  }, []);

  // Guarda cada cambio.
  useEffect(() => {
    if (state) writeStored(prune(state, ymd(new Date())));
  }, [state]);

  const water = loaded?.water ?? null;

  // Aviso cuando suena un recordatorio. Un solo aviso por revisión; los demás se confirman en orden.
  useEffect(() => {
    if (!water || !state) return;
    const date = ymd(now);
    if (dayTotal(dayOf(state, date)) >= state.goal) return;
    const due = slotsFor(water, state, date, now).find(x => x.state === 'due' && !notified.current.has(x.id));
    if (due) {
      notified.current.add(due.id);
      notify({
        title: '¡Hora de tomar agua!',
        body: 'Toca «Confirmar recordatorio» en Hoy.',
        tone: 'good',
        icon: 'drop',
      });
    }
  }, [water, state, now, notify]);

  // Estadísticas para los logros, calculadas del progreso y de levels.json.
  const categories = useMemo(
    () => (loaded ? buildCategories(loaded.levels, state ? levelBestStars(state) : {}) : []),
    [loaded, state],
  );

  const achievements = useMemo<AchievementView[]>(() => {
    if (!loaded || !state) return [];
    const totals = summarizeLevels(categories);
    const stats: AchievementStats = {
      levelsDone: totals.done,
      stars: totals.stars,
      streak: streakOf(state, ymd(now)),
      waterGoalDays: state.goalDays.length,
      categoriesDone: categories.filter(c => c.done === c.levels.length).length,
    };
    return achievementViews(loaded.achievements, stats, state.unlocked);
  }, [loaded, state, categories, now]);

  // Logros recién cumplidos: se guardan con su fecha y se avisa una vez.
  useEffect(() => {
    if (!state) return;
    const fresh = achievements.filter(a => a.reached && a.unlockedOn === null);
    if (fresh.length === 0) return;
    const date = ymd(new Date());
    setState(prev => (prev
      ? { ...prev, unlocked: { ...prev.unlocked, ...Object.fromEntries(fresh.map(a => [a.def.id, date])) } }
      : prev));
    fresh.forEach(a => notify({
      title: 'Logro desbloqueado',
      body: `${a.def.title}: ${a.def.detail}`,
      tone: 'good',
      icon: 'trophy',
    }));
  }, [achievements, state, notify]);

  // Aplica una acción sobre el estado actual, con la fecha y hora del momento.
  const apply = useCallback((fn: (s: ProgressState, date: string, when: Date) => ProgressState) => {
    setState(prev => {
      if (!prev) return prev;
      const when = new Date();
      return fn(prev, ymd(when), when);
    });
  }, []);

  const setFocus = useCallback((f: Focus) => setFocusState(f), []);
  const clearFocus = useCallback(() => setFocusState(null), []);

  const completeLevel = useCallback(
    (key: string, stars: number) => apply((s, date) => finishLevel(s, key, stars, date)),
    [apply],
  );
  const confirmReminder = useCallback(() => {
    if (water) apply((s, date, when) => confirmSlot(water, s, date, when));
  }, [apply, water]);
  const logWater = useCallback((glasses: number) => {
    if (water) apply((s, date, when) => logGlasses(water, s, date, when, glasses));
  }, [apply, water]);
  const undoWater = useCallback(() => apply(s => undoLastLog(s, ymd(new Date()))), [apply]);
  const setGoal = useCallback((goal: number) => {
    if (water) apply(s => changeGoal(water, s, goal));
  }, [apply, water]);
  const forceReminder = useCallback(() => {
    if (water) apply((s, date, when) => forceNext(water, s, date, when));
  }, [apply, water]);
  const setPicture = useCallback((pic: PictureChoice) => apply(s => setPictureIn(s, pic)), [apply]);
  const setTone = useCallback((tone: AvatarTone) => apply(s => setToneIn(s, tone)), [apply]);

  const bestStars = useMemo(() => (state ? levelBestStars(state) : {}), [state]);

  const value = useMemo<ProgressValue | null>(() => {
    if (!water || !state) return null;
    return {
      now,
      date: ymd(now),
      water,
      state,
      bestStars,
      focus,
      setFocus,
      clearFocus,
      demoReminder: FEATURES.demoReminder,
      completeLevel,
      confirmReminder,
      logWater,
      undoWater,
      setGoal,
      forceReminder,
      avatar: state.avatar,
      photo: state.photo,
      tone: state.tone,
      setPicture,
      setTone,
      achievements,
    };
  }, [now, water, state, bestStars, focus, setFocus, clearFocus, completeLevel, confirmReminder,
    logWater, undoWater, setGoal, forceReminder, setPicture, setTone, achievements]);

  if (error) {
    return (
      <PhoneFrame>
        <div className="screen">
          <div className="screen-scroll">
            <LoadError message={error} onRetry={() => setAttempt(a => a + 1)} />
          </div>
        </div>
      </PhoneFrame>
    );
  }
  if (!value) {
    return (
      <PhoneFrame>
        <div className="screen">
          <div className="screen-scroll">
            <Loading />
          </div>
        </div>
      </PhoneFrame>
    );
  }
  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}

export function useProgress(): ProgressValue {
  const ctx = useContext(ProgressCtx);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
