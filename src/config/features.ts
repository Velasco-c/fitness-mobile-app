/**
 * Funciones opcionales. Pon un valor en true para reactivar la función.
 * Por defecto están apagadas: la app se usa con la cámara y no pide datos extra.
 */
export type FeatureKey = 'profile' | 'registerGoal' | 'demoReminder';

export const FEATURES: Record<FeatureKey, boolean> = {
  /** Pestaña Perfil (foto, logros, avatares, apariencia claro/oscuro y cerrar sesión). */
  profile: true,
  /** Campo «Meta» en el registro. */
  registerGoal: false,
  /** Botón «Probar recordatorio» dentro de la meta de agua. Útil para probar; apágalo en la versión final. */
  demoReminder: true,
};
