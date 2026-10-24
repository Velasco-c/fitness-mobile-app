import type { AvatarArt } from '../types';

/**
 * Imagen que se muestra en el círculo del perfil: la ilustración elegida o,
 * si no hay, la foto propia. null = solo color de fondo.
 */
export function pictureSrc(avatar: string | null, photo: string | null, arts: AvatarArt[]): string | null {
  if (avatar) return arts.find(a => a.id === avatar)?.src ?? photo;
  return photo;
}
