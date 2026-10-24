/** Marcadores mientras llegan los datos del backend simulado. */
export function Loading() {
  return (
    <div className="load-state" aria-busy="true" aria-label="Cargando">
      <span className="skel skel-title" />
      <span className="skel skel-block" />
      <span className="skel skel-block short" />
    </div>
  );
}

interface LoadErrorProps {
  message: string | null;
  onRetry: () => void;
}

export function LoadError({ message, onRetry }: LoadErrorProps) {
  return (
    <div className="load-state load-error" role="alert">
      <p>{message ?? 'No se pudieron cargar los datos.'}</p>
      <button className="link-btn" onClick={onRetry}>Reintentar</button>
    </div>
  );
}
