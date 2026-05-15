// ── SANITIZACIÓN ESTRICTA (Anti-XSS) ─────────────────────────────────────────
// Mismas regex probadas de WiiHope → adaptadas a TypeScript
export const sanName  = (v: string) => v.replace(/[<>="'`;/\\$}{]/g, '').replace(/\s{2,}/g, ' ');
export const sanEmail = (v: string) => v.replace(/[<>="'`;/\\$}{ ]/g, '').toLowerCase().trim();
export const sanUser  = (v: string) => v.toLowerCase().replace(/[^a-z0-9_-]/g, '').trim();
export const sanSlug  = (v: string) => v.toLowerCase().replace(/[^a-z0-9-]/g, '').trim();

// ── VALIDACIÓN ───────────────────────────────────────────────────────────────
export const validar = {
  email:     (v: string) => /^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v) || "Email inválido",
  usuario:   (v: string) => v.length >= 4 || "Mínimo 4 caracteres",
  nombre:    (v: string) => v.trim().length > 0 || "Ingresa tu nombre",
  apellidos: (v: string) => v.trim().length > 0 || "Ingresa tus apellidos",
  password:  (v: string) => v.length >= 6 || "Mínimo 6 caracteres",
  passConf:  (v: string, pass: string) => v === pass || "No coinciden",
  slug:      (v: string) => v.length >= 3 || "Mínimo 3 caracteres",
};

// ── ERRORES AUTH — Supabase → mensaje amigable ───────────────────────────────
export const errAuth: Record<string, string> = {
  "user_already_exists":       "Email ya registrado",
  "invalid_credentials":       "Credenciales incorrectas",
  "email_not_confirmed":       "Verifica tu email primero",
  "over_request_rate_limit":   "Demasiados intentos, espera un momento",
  "weak_password":             "Contraseña débil (mín. 6 caracteres)",
  "invalid_email":             "Email no válido",
  "signup_disabled":           "Registro deshabilitado temporalmente",
  "email_address_not_authorized": "Email no autorizado",
};

// Extraer mensaje amigable de error Supabase
export const msgError = (error: any): string => {
  const code = error?.code || error?.message || "";
  return errAuth[code] || error?.message || "Error inesperado";
};
