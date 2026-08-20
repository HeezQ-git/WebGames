const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;
const SORT_OPTIONS = ['ALPHABETICAL', 'LATEST_FIRST', 'OLDEST_FIRST'];

const validateUsername = (username) => {
  if (typeof username !== 'string' || !username) return 'Username is required';
  if (username.length < 4) return 'Username is too short (min 4)';
  if (username.length > 16) return 'Username is too long (max 16)';
  if (!USERNAME_PATTERN.test(username))
    return 'Username can only contain letters, numbers, and underscores';
  return null;
};

const validatePassword = (password) => {
  if (typeof password !== 'string' || !password) return 'Password is required';
  if (password.length < 8) return 'Password is too short (min 8)';
  if (password.length > 72) return 'Password is too long (max 72)';
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain a number';
  return null;
};

const isObjectId = (value) =>
  typeof value === 'string' && OBJECT_ID_PATTERN.test(value);

module.exports = {
  validateUsername,
  validatePassword,
  isObjectId,
  SORT_OPTIONS,
};
