import { createContext, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../api/authApi';
import { toast } from '../components/common/Toast';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  // Restore the session synchronously so protected routes never flash /login.
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsSubmitting(true);
    try {
      const user = await loginUser(email, password);
      setCurrentUser(user);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}.`);
      return { ok: true, user };
    } catch (error) {
      toast.error(error.message || 'Could not log in.');
      return { ok: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    setIsSubmitting(true);
    try {
      const user = await registerUser({ name, email, password });
      setCurrentUser(user);
      toast.success('Account created. Welcome to PraharX.');
      return { ok: true, user };
    } catch (error) {
      toast.error(error.message || 'Could not create your account.');
      return { ok: false, error: error.message, status: error.status };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Cart and wishlist are intentionally left untouched on logout.
  const logout = useCallback(async () => {
    await logoutUser();
    navigate('/', { replace: true });
    setCurrentUser(null);
    toast.success('You have been logged out.');
  }, [navigate]);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isSubmitting,
      login,
      signup,
      logout,
    }),
    [currentUser, isSubmitting, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
