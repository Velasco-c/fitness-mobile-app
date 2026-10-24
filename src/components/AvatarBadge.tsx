interface AvatarBadgeProps {
  /** Imagen del círculo (ilustración o foto). null muestra solo el color. */
  src: string | null;
  /** Color de fondo. */
  tone: string;
  size?: number;
}

/** Círculo del avatar: color de fondo y la imagen encima. Se usa en el perfil y en el panel. */
export function AvatarBadge({ src, tone, size = 112 }: AvatarBadgeProps) {
  return (
    <span className={`photo avatar-badge tone-${tone}`} style={{ width: size, height: size }} role="img" aria-label="Tu avatar">
      {src && <img src={src} alt="" draggable={false} />}
    </span>
  );
}
