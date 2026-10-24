import { useEffect } from 'react';
import { Figure } from './Figure';

/** Duración de la bienvenida (ms). Debe coincidir con welcome.css. */
export const WELCOME_MS = 2700;

interface WelcomeProps {
  name: string;
  onDone: () => void;
}

/**
 * Bienvenida tras iniciar sesión (cuenta u offline): el monito cae, salta de
 * alegría, crece y una burbuja celeste se expande hasta cubrir la pantalla.
 */
export function Welcome({ name, onDone }: WelcomeProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, WELCOME_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="welcome" role="status">
      <span className="welcome-burst" aria-hidden="true" />
      <div className="welcome-body">
        <Figure className="welcome-figure" />
        <p className="welcome-text">¡Hola, {name}!</p>
      </div>
    </div>
  );
}
