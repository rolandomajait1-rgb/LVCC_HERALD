// Input sanitization utilities
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .slice(0, 1000); // Limit length
};

export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  
  return email
    .trim()
    .toLowerCase()
    .slice(0, 255);
};

export const sanitizeName = (name) => {
  if (typeof name !== 'string') return '';
  
  return name
    .trim()
    .replace(/[<>{}[\]]/g, '')
    .slice(0, 255);
};

export const sanitizeSearchQuery = (query) => {
  if (typeof query !== 'string') return '';
  
  return query
    .trim()
    .replace(/[<>{}[\]]/g, '')
    .slice(0, 200);
};
