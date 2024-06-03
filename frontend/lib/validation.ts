import { fetcher } from "./fetcher";

export const validateUsername = (username?: string | null) => {
  if (!username) return 'Username is required';
  else if (username?.length < 4) return 'Username is too short (min 4)';
  else if (username?.length > 16) return 'Username is too long (max 16)';
  else if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
  return null;
}

export const validatePassword = (password: string) => {
  if (!password) return 'Password is required';
  else if (password.length < 8) return 'Password is too short';
  else if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
  else if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  else if (!/[0-9]/.test(password)) return 'Password must contain a number';
  return null;
}

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!password) return 'Password confirmation is required';
  else if (password !== confirmPassword) return 'Passwords do not match';
  return null;
}

export const checkUsername = async (username: string, setLoading?: (loading: boolean) => void): Promise<boolean> => {
  setLoading?.(true);

  const response = await fetcher('POST', { wholeResponse: true })(
    'api/auth/check-username',
    { username }
  );

  setLoading?.(false);
  return response.data?.exists;
}