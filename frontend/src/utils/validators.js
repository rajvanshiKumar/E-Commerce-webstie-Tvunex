export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email = '') {
  return EMAIL_PATTERN.test(email.trim());
}

export function validateEmail(email = '') {
  if (!email.trim()) return 'Email is required.';
  if (!isValidEmail(email)) return 'Enter a valid email address.';
  return '';
}

export function validateLogin({ email = '', password = '' }) {
  const errors = {};
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  if (!password) errors.password = 'Password is required.';
  return errors;
}

export function validateSignup({ name = '', email = '', password = '', confirmPassword = '' }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required.';
  else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) errors.password = 'Password is required.';
  else if (password.length < MIN_PASSWORD_LENGTH)
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;

  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.';
  else if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match.';

  return errors;
}
