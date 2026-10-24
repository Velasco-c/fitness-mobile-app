import { useCallback, useEffect, useState } from 'react';

export interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Carga datos con un loader asíncrono. Si el componente se desmonta antes de
 * que llegue la respuesta, el resultado se descarta. reload() vuelve a pedirlos.
 */
export function useData<T>(loader: () => Promise<T>): DataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setError(null);
    loader()
      .then(result => { if (alive) setData(result); })
      .catch((err: unknown) => {
        if (alive) setError(err instanceof Error ? err.message : 'Ocurrió un error al cargar.');
      });
    return () => { alive = false; };
    // El loader cambia en cada render; solo se vuelve a pedir con reload().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const reload = useCallback(() => setAttempt(n => n + 1), []);

  return { data, loading: data === null && error === null, error, reload };
}
