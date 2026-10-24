export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  goal: string;
}

export type RegisterErrors = Partial<Record<keyof RegisterInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Reglas del formulario de registro. Devuelve un objeto vacío si todo es válido. */
export function validateRegister(v: RegisterInput): RegisterErrors {
  const errors: RegisterErrors = {};
  if (v.name.trim().length < 2) errors.name = 'Usa al menos 2 caracteres.';
  if (!EMAIL_RE.test(v.email.trim())) errors.email = 'Escribe un correo válido.';
  if (v.password.length < 6) errors.password = 'Usa al menos 6 caracteres.';
  return errors;
}
