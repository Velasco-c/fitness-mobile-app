import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from 'react';
import { useApp } from '../context/AppContext';
import { GOALS } from '../data/goals';
import { validateRegister, type RegisterErrors, type RegisterInput } from '../utils/validate';
import type { Goal } from '../types';

const EMPTY: RegisterInput = { name: '', email: '', password: '', goal: 'move' };

/** Formulario de registro: valida, crea el usuario y lanza una notificación. */
export function RegisterForm() {
  const { setUser, notify } = useApp();
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
    setUser({ name, email: form.email.trim(), goal });
    notify({
      title: 'Account created',
      body: `Welcome, ${name}. Your goal: ${GOALS.find(g => g.id === goal)?.label}.`,
      tone: 'good',
    });
  };

  return (
    <form className="register" onSubmit={onSubmit} noValidate>
      <Field label="Name" name="name" value={form.name} onChange={onChange} error={errors.name} autoComplete="name" />
      <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} autoComplete="email" />
      <Field label="Password" name="password" type="password" value={form.password} onChange={onChange} error={errors.password} autoComplete="new-password" />
      <label className="field">
        <span>Goal</span>
        <select name="goal" value={form.goal} onChange={onChange}>
          {GOALS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
        </select>
      </label>
      <button className="btn-cream" type="submit">Create account</button>
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
