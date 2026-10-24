interface FigureProps {
  className?: string;
}

/**
 * Figura de KidFit (el monito del logo). Tomada de Vector.svg.
 * Las clases figure-body y figure-face permiten colorearla según el contexto.
 */
export function Figure({ className }: FigureProps) {
  return (
    <svg className={className} viewBox="0 0 124 140" aria-hidden="true">
      <path
        className="figure-body"
        d="M59.9813 0C75.0624 0 87.288 12.5331 87.288 27.9934C87.288 34.5945 85.0584 40.6613 81.3301 45.4474L120.141 34.3448L124 48.0493L64.2152 65.1523L73.4984 137.451L53.9583 140L46.9388 85.3309L21.8197 135.236L0.993276 124.586L36.5511 53.9422L0 10.1065L10.8203 0.940954L32.687 27.1655C33.1141 12.0881 45.1704 0 59.9813 0Z"
      />
      <path className="figure-face" d="M56.2729 15.9962C65.0921 44.1726 75.8704 34.8739 80.1571 26.7025L56.2729 15.9962Z" />
    </svg>
  );
}
