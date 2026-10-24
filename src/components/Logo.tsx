import { Figure } from './Figure';

/** Logo de KidFit: KID / figura / FIT. Colores por tema (login.css). */
export function Logo() {
  return (
    <div className="logo" role="img" aria-label="KidFit">
      <div className="logo-word" aria-hidden="true">
        <span className="logo-letter">K</span>
        <span className="logo-letter">I</span>
        <span className="logo-letter">D</span>
      </div>
      <Figure className="logo-figure" />
      <div className="logo-word" aria-hidden="true">
        <span className="logo-letter">F</span>
        <span className="logo-letter">I</span>
        <span className="logo-letter">T</span>
      </div>
    </div>
  );
}
