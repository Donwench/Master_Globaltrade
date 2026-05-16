'use client';

import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, requiredRoles, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredRoles && user && !requiredRoles.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, requiredRoles, router]);

  if (!isAuthenticated) {
    return fallback || <div>Loading...</div>;
  }

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return fallback || <div>Access Denied</div>;
  }

  return <>{children}</>;
}
