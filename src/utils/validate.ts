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
  if (v.name.trim().length < 2) errors.name = 'Use at least 2 characters.';
  if (!EMAIL_RE.test(v.email.trim())) errors.email = 'Enter a valid email.';
  if (v.password.length < 6) errors.password = 'Use at least 6 characters.';
  return errors;
}
