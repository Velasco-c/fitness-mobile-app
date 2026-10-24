import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from 'react';
import { FEATURES } from '../config/features';
import { useApp } from '../context/AppContext';
import { GOALS } from '../data/goals';
import { validateRegister, type RegisterErrors, type RegisterInput } from '../utils/validate';
import type { Goal } from '../types';

const EMPTY: RegisterInput = { name: '', email: '', password: '', goal: 'move' };

/** Formulario de registro: valida, abre la sesión y lanza una notificación. El campo «Meta» depende de features.ts. */
export function RegisterForm() {
  const { startSession, notify } = useApp();
  const [form, setForm] = useState<RegisterInput>(EMPTY);
  const [errors, setErrors] = useState<RegisterErrors>({});

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateRegister(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const goal = form.goal as Goal;
    const name = form.name.trim();
    startSession(
      { id: `local-${Date.now()}`, name, email: form.email.trim(), goal, avatar: 'a2' },
      'online',
    );
    notify({
      title: 'Cuenta creada',
      body: FEATURES.registerGoal
        ? `Bienvenida, ${name}. Tu meta: ${GOALS.find(g => g.id === goal)?.label}.`
        : `Bienvenida, ${name}.`,
      tone: 'good',
      icon: 'star',
    });
  };

  return (
    <form className="register" onSubmit={onSubmit} noValidate>
      <Field label="Nombre" name="name" value={form.name} onChange={onChange} error={errors.name} autoComplete="name" />
      <Field label="Correo" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} autoComplete="email" />
      <Field label="Contraseña" name="password" type="password" value={form.password} onChange={onChange} error={errors.password} autoComplete="new-password" />
      {FEATURES.registerGoal && (
        <label className="field">
          <span>Meta</span>
          <select name="goal" value={form.goal} onChange={onChange}>
            {GOALS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
          </select>
        </label>
      )}
      <button className="btn-primary" type="submit">Crear cuenta</button>
    </form>
  );
}

type FieldProps = { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>;

function Field({ label, error, ...input }: FieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...input} aria-invalid={Boolean(error)} />
      {error && <small className="error">{error}</small>}
    </label>
  );
}
