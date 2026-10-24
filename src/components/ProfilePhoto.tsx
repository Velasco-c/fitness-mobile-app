import type { AvatarTone } from '../types';

interface ProfilePhotoProps {
  src: string;
  tone: AvatarTone;
  size?: number;
  alt?: string;
}

/** Foto de perfil circular con anillo del color del avatar elegido. */
export function ProfilePhoto({ src, tone, size = 112, alt = '' }: ProfilePhotoProps) {
  return (
    <span className={`photo tone-${tone}`} style={{ width: size, height: size }}>
      <img src={src} alt={alt} draggable={false} />
    </span>
  );
}
