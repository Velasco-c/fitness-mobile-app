import { useState, type FormEvent } from 'react';
import { Icon } from '../components/Icons';
import { Logo } from '../components/Logo';
import { RegisterForm } from '../components/RegisterForm';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

type View = 'home' | 'signin' | 'register';

/**
 * Acceso con dos opciones: «Iniciar sesión» (correo y contraseña, validados
 * contra el JSON simulado) y «Modo offline» (entra con los datos guardados).
 */
export function Login() {
  const { startSession } = useApp();
  const [view, setView] = useState<View>('home');
  const [busy, setBusy] = useState<'online' | 'offline' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const go = (next: View) => {
    setError(null);
    setView(next);
  };

  const enterOffline = async () => {
    setBusy('offline');
    setError(null);
    try {
      const user = await api.offlineUser();
      startSession(user, 'offline');
    } catch {
      setError('No hay datos guardados para el modo offline.');
      setBusy(null);
    }
  };

  const signIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Escribe tu correo y tu contraseña.');
      return;
    }
    setBusy('online');
    setError(null);
    try {
      const user = await api.signIn(email, password);
      if (user) {
        startSession(user, 'online');
      } else {
        setError('Correo o contraseña incorrectos.');
        setBusy(null);
      }
    } catch {
      setError('Sin conexión. Prueba el modo offline.');
      setBusy(null);
    }
  };

  if (view === 'register') {
    return (
      <div className="screen-scroll login-register">
        <header className="screen-head">
          <button className="icon-btn" onClick={() => go('signin')} aria-label="Volver">
            <Icon name="chevron" className="flip" />
          </button>
          <h2>Crear cuenta</h2>
          <span className="icon-btn-spacer" aria-hidden="true" />
        </header>
        <RegisterForm />
      </div>
    );
  }

  if (view === 'signin') {
    return (
      <div className="screen-scroll login-register">
        <header className="screen-head">
          <button className="icon-btn" onClick={() => go('home')} aria-label="Volver">
            <Icon name="chevron" className="flip" />
          </button>
          <h2>Iniciar sesión</h2>
          <span className="icon-btn-spacer" aria-hidden="true" />
        </header>

        <form className="register" onSubmit={signIn} noValidate>
          <label className="field">
            <span>Correo</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="field">
            <span>Contraseña</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error && <p className="error" role="alert">{error}</p>}

          <button className="btn-primary" type="submit" disabled={busy !== null}>
            {busy === 'online' ? 'Entrando…' : 'Entrar'}
          </button>
          <p className="hint">Demo: sofia@kidfit.app · contraseña 1234</p>
          <button className="link-btn center" type="button" onClick={() => go('register')}>
            ¿No tienes cuenta? Crear cuenta
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="login">
      <Logo />
      <div className="login-actions">
        <button className="glass-btn glass-btn-main" onClick={() => go('signin')} disabled={busy !== null}>
          Iniciar sesión
        </button>
        <button className="glass-btn glass-btn-alt" onClick={enterOffline} disabled={busy !== null}>
          {busy === 'offline' ? 'Abriendo…' : 'Modo offline'}
        </button>
        <p className="login-caption">Modo offline usa tus datos guardados, sin internet.</p>
        {error && <p className="error login-error" role="alert">{error}</p>}
      </div>
    </div>
  );
}
