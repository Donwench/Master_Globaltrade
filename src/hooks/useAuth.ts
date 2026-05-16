import { useAuthStore } from '@/store/authStore';
import { useCallback } from 'react';

export function useAuth() {
  const { user, company, tokens, isAuthenticated, isLoading, error, setAuth, logout, setLoading, setError, updateUser, updateCompany } = useAuthStore();

  const hasRole = useCallback(
    (role: string | string[]) => {
      if (!user) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(user.role);
    },
    [user],
  );

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user || user.role === 'admin') return true;
      // Add permission logic here
      return false;
    },
    [user],
  );

  return {
    user,
    company,
    tokens,
    isAuthenticated,
    isLoading,
    error,
    setAuth,
    logout,
    setLoading,
    setError,
    updateUser,
    updateCompany,
    hasRole,
    hasPermission,
  };
}
