import type { ReactNode } from 'react';

export type IconName =
  | 'home' | 'sun' | 'map' | 'user'
  | 'bell' | 'check' | 'close' | 'chevron' | 'lock' | 'plus' | 'play'
  | 'star' | 'flame' | 'drop' | 'gift' | 'trophy' | 'camera'
  | 'wifi-off' | 'logout' | 'mail' | 'key'
  | 'minus' | 'bag' | 'more' | 'arrow'
  | 'moon' | 'hourglass' | 'cloud' | 'pencil' | 'trash';

/** Trazos de 24×24, estilo línea redondeada (como la barra del mockup). */
const PATHS: Record<IconName, ReactNode> = {
  home: <path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1h-4.5v-6h-6v6H4.5a1 1 0 0 1-1-1z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
    </>
  ),
  map: <path d="M9 4.5 3.5 6.8v13.7L9 18.2l6 2.3 5.5-2.3V4.5L15 6.8 9 4.5zM9 4.5v13.7M15 6.8v13.7" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c1.4-4 4.3-6 7.5-6s6.1 2 7.5 6" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  chevron: <path d="M9 18l6-6-6-6" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />,
  star: <path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.2l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  flame: <path d="M12 21a6.5 6.5 0 0 0 6.5-6.5c0-3.5-2.4-5.6-3.8-7.1-.3 1.6-1.1 2.8-2.2 3.4C12.3 7.6 11.4 4.6 9 3c.2 2.8-.8 4.5-2.1 6C5.7 10.4 5.5 12 5.5 14.5A6.5 6.5 0 0 0 12 21z" />,
  drop: <path d="M12 3.5c3 4.2 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 3-6.8 6-11z" />,
  gift: (
    <>
      <rect x="3.5" y="9" width="17" height="4" rx="1" />
      <path d="M5 13h14v7.5H5zM12 9v11.5M12 9c-1.3-2.6-4.6-3.6-4.6-1.2S9.8 9 12 9zM12 9c1.3-2.6 4.6-3.6 4.6-1.2S14.2 9 12 9z" />
    </>
  ),
  trophy: <path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0zM7.5 6.5H4.5a3 3 0 0 0 3 3.5M16.5 6.5h3a3 3 0 0 1-3 3.5M12 13.5V17M8 20.5h8M9.5 17h5" />,
  camera: (
    <>
      <path d="M4 8h3.2l1.6-2.5h6.4L16.8 8H20v11.5H4z" />
      <circle cx="12" cy="13.5" r="3.2" />
    </>
  ),
  'wifi-off': (
    <>
      <path d="M2.5 2.5l19 19M8.5 16.4a5 5 0 0 1 7 0M5.2 12.9a10 10 0 0 1 4.1-2.5M18.8 12.9a10 10 0 0 0-3.3-2.1M2.5 9.2A15 15 0 0 1 6 6.9" />
      <path d="M12 20h.01" />
    </>
  ),
  logout: <path d="M9 21H5.5A1.5 1.5 0 0 1 4 19.5v-15A1.5 1.5 0 0 1 5.5 3H9M16 17l5-5-5-5M21 12H9" />,
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l9-9M17 6l3 3M14 9l2 2" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  bag: (
    <>
      <path d="M5 8h14l-1 12H6z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  arrow: <path d="M19 12H5M11 6l-6 6 6 6" />,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="currentColor" />,
  hourglass: <path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9" />,
  cloud: <path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 10.5 3.8 3.8 0 0 1 17.5 18z" fill="currentColor" />,
  pencil: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </>
  ),
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

/** Iconos de trazo (stroke) que heredan el color del texto. */
export function Icon({ name, size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
