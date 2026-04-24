export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  return password.length >= 6;
}

export function validatePostMessage(message) {
  return message.trim().length > 0 && message.length <= 1000;
}

export function validateCommentMessage(message) {
  return message.trim().length > 0 && message.length <= 500;
}

export function validateCoordinates(latitude, longitude) {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  return !isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

export function getErrorMessage(field, error) {
  if (typeof error === 'string') return error;
  if (Array.isArray(error)) return error[0];
  return `Invalid ${field}`;
}
