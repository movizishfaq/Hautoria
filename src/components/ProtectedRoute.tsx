import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';
import type { UserRole } from '../types/domain';

function AuthSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    </div>
  );
}

export function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: UserRole[];
}) {
  const { user, authReady } = useAppState();
  const location = useLocation();

  if (!authReady) return <AuthSpinner />;
  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  if (roles?.length && user.role && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
