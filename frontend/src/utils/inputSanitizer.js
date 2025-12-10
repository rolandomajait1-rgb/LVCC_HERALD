export const sanitizeEmail = (email) => {
  if (!email) return '';
  return email.trim().toLowerCase();
};

export const sanitizeName = (name) => {
  if (!name) return '';
  return name.trim().replace(/[<>]/g, '');
};

export const sanitizeText = (text) => {
  if (!text) return '';
  return text.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};