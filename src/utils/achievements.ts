import type { AchievementDef } from '../types';

/** Lo que cuentan las reglas de los logros, calculado del progreso. */
export interface AchievementStats {
  levelsDone: number;
  stars: number;
  streak: number;
  waterGoalDays: number;
  categoriesDone: number;
}

export interface AchievementView {
  def: AchievementDef;
  /** Progreso actual, sin pasar del objetivo. */
  value: number;
  target: number;
  /** La regla ya se cumple en este momento. */
  reached: boolean;
  /** Fecha en que se desbloqueó, si ya se desbloqueó. */
  unlockedOn: string | null;
}

/** Un logro está desbloqueado si ya se cumplió alguna vez (aunque después la racha se corte). */
export const isUnlocked = (a: AchievementView) => a.unlockedOn !== null || a.reached;

/** Calcula el progreso de cada logro a partir de sus reglas. */
export function achievementViews(
  defs: AchievementDef[],
  stats: AchievementStats,
  unlocked: Record<string, string>,
): AchievementView[] {
  return defs.map(def => {
    const raw = stats[def.rule.type];
    const target = def.rule.count;
    return {
      def,
      value: Math.min(raw, target),
      target,
      reached: raw >= target,
      unlockedOn: unlocked[def.id] ?? null,
    };
  });
}
