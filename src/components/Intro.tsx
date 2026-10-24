import { useEffect } from 'react';
import { Logo } from './Logo';

/** Duración de la intro (ms). Debe coincidir con la animación de intro.css. */
export const INTRO_MS = 2600;

interface IntroProps {
  onDone: () => void;
}

/** Entrada: el monito salta de alegría y luego todo se expande y deja ver el acceso. */
export function Intro({ onDone }: IntroProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, INTRO_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-stage">
        <Logo />
      </div>
    </div>
  );
}
