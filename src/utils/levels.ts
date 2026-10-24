import type {
  Category, CategoryEntry, Level, LevelStars, LevelStatus, LevelsData, LevelTotals,
} from '../types';

/** Estrellas máximas por nivel. */
const MAX_STARS = 3;

/** Clave estable de un nivel: id de la categoría + número. Sirve para guardar su progreso. */
export const levelKey = (categoryId: string, number: number) => `${categoryId}:${number}`;

/**
 * Revisa levels.json antes de usarlo. Si algo está mal, la pantalla muestra el
 * motivo con «Reintentar» en vez de romperse.
 */
export function checkLevels(data: LevelsData): LevelsData {
  if (!data.categories?.length) throw new Error('levels.json no tiene categorías.');
  const ids = new Set<string>();
  data.categories.forEach(cat => {
    if (ids.has(cat.id)) throw new Error(`Hay dos categorías con el id «${cat.id}».`);
    ids.add(cat.id);
    if (!cat.levels?.length) throw new Error(`«${cat.name}» no tiene niveles.`);
    cat.levels.forEach((l, i) => {
      if (![1, 2, 3].includes(l.difficulty)) {
        throw new Error(`Dificultad no válida en «${cat.name}», nivel ${i + 1}.`);
      }
    });
  });
  return data;
}

/** Estrellas que trae levels.json como punto de partida (solo los niveles con estrellas). */
export function seedLevelStars(data: LevelsData): { key: string; stars: number }[] {
  return data.categories.flatMap(cat =>
    cat.levels
      .map((l, i) => ({ key: levelKey(cat.id, i + 1), stars: l.stars }))
      .filter(x => x.stars > 0),
  );
}

/**
 * Convierte levels.json en categorías con número, estrellas y estado calculados.
 * Las estrellas son el mayor valor entre levels.json y lo jugado (bestStars).
 * Un nivel está completado si tiene estrellas. El primero sin completar es el
 * actual y los siguientes quedan bloqueados. Cada categoría avanza por separado.
 */
export function buildCategories(data: LevelsData, bestStars: Record<string, number> = {}): Category[] {
  return data.categories.map((cat: CategoryEntry) => {
    const base = cat.levels.map((l, i) => {
      const key = levelKey(cat.id, i + 1);
      const stars = Math.max(l.stars, bestStars[key] ?? 0, 0) as LevelStars;
      return { ...l, id: key, number: i + 1, stars };
    });
    const open = base.findIndex(l => l.stars === 0);
    const levels: Level[] = base.map((l, i): Level => {
      const status: LevelStatus = l.stars > 0 ? 'done' : i === open ? 'current' : 'locked';
      return { ...l, status };
    });
    return {
      id: cat.id,
      name: cat.name,
      subtitle: cat.subtitle,
      tone: cat.tone,
      levels,
      done: levels.filter(l => l.status === 'done').length,
      stars: levels.reduce((sum, l) => sum + l.stars, 0),
      maxStars: levels.length * MAX_STARS,
    };
  });
}

/** Totales de todas las categorías y el siguiente nivel pendiente. */
export function summarizeLevels(categories: Category[]): LevelTotals {
  let next: LevelTotals['next'] = null;
  for (const category of categories) {
    const level = category.levels.find(l => l.status === 'current');
    if (level && !next) next = { category, level };
  }
  const sum = (pick: (c: Category) => number) => categories.reduce((n, c) => n + pick(c), 0);
  return {
    categories: categories.length,
    levels: sum(c => c.levels.length),
    done: sum(c => c.done),
    stars: sum(c => c.stars),
    maxStars: sum(c => c.maxStars),
    next,
  };
}
