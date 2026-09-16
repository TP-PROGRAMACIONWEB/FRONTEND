const ignored_phone_formatting = /[\s()+-]/g;

export function normalize_phone(phone: string) {
  return phone.replace(ignored_phone_formatting, "");
}

export function get_phone_error(phone: string) {
  if (!phone) return null;

  const normalized_phone = normalize_phone(phone);
  if (!/^\d+$/.test(normalized_phone)) {
    return "El teléfono solo puede contener dígitos y los separadores indicados.";
  }
  if (normalized_phone.length > 11) {
    return "El teléfono puede tener hasta 11 dígitos.";
  }
  return null;
}

export function is_valid_phone(phone: string) {
  return Boolean(phone) && get_phone_error(phone) === null;
}

export function get_email_error(email: string) {
  if (!email) return null;
  if (/\s/.test(email)) return "El correo no puede contener espacios.";
  if (!email.includes("@")) return "El correo debe contener @.";
  if (!email.toLowerCase().endsWith(".com")) {
    return "El correo debe finalizar en .com.";
  }
  return null;
}

export function is_valid_email(email: string) {
  return Boolean(email) && get_email_error(email) === null;
}
