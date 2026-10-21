import type { ReactNode } from 'react';

export type IconName =
  | 'summary' | 'apps' | 'pulse' | 'profile' | 'bell' | 'check' | 'close'
  | 'chevron' | 'plus' | 'heart' | 'moon' | 'hourglass' | 'cloud' | 'arrow';

const PATHS: Record<IconName, ReactNode> = {
  summary: <circle cx="12" cy="12" r="8" strokeWidth={3} />,
  apps: (
    <>
      <circle cx="8.5" cy="8.5" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8.5" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="15.5" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="3.5" fill="currentColor" stroke="none" />
    </>
  ),
  pulse: <path d="M3 12h4l2-5 4 10 2-5h6" />,
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
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
  plus: <path d="M12 5v14M5 12h14" />,
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="currentColor" />,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="currentColor" />,
  hourglass: <path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9" />,
  cloud: <path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 10.5 3.8 3.8 0 0 1 17.5 18z" fill="currentColor" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
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
