import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, UserRole } from '../types/domain';

import { isApiEnabled } from '../services/api';

const ADMIN_ROLES: UserRole[] = ['admin', 'manager', 'sales', 'support'];

type AdminAuthState = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Context = createContext<AdminAuthState | undefined>(undefined);

function readCachedAdmin(): User | null {
  const raw = localStorage.getItem('hautoria_user');
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as User;
    if (parsed.role && ADMIN_ROLES.includes(parsed.role)) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readCachedAdmin());
  // If we already have a cached admin session, don't block the shell on /auth/me.
  const [loading, setLoading] = useState(() => {
    try {
      return !readCachedAdmin();
    } catch {
      return true;
    }
  });

  useEffect(() => {
    void (async () => {
      if (!isApiEnabled()) {
        setLoading(false);
        return;
      }
      try {
        const { authService } = await import('../services/authService');
        const me = await authService.getMe();
        if (me?.role && ADMIN_ROLES.includes(me.role)) {
          setUser(me);
          localStorage.setItem('hautoria_user', JSON.stringify(me));
        } else {
          setUser(null);
          localStorage.removeItem('hautoria_user');
        }
      } catch {
        // Keep cached admin for offline-feel; only clear if we never had one.
        if (!readCachedAdmin()) setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { authService } = await import('../services/authService');
    const signedIn = await authService.signIn(email, password);
    if (!signedIn.role || !ADMIN_ROLES.includes(signedIn.role)) {
      await authService.signOut();
      throw new Error('This account does not have admin access.');
    }
    setUser(signedIn);
    localStorage.setItem('hautoria_user', JSON.stringify(signedIn));
  };

  const logout = async () => {
    const { authService } = await import('../services/authService');
    await authService.signOut();
    setUser(null);
    localStorage.removeItem('hautoria_user');
  };

  return (
    <Context.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
}
