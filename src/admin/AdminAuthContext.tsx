import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, UserRole } from '../types/domain';

import { getAccessToken, isApiEnabled, setAccessToken } from '../services/api';

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

function clearAdminSession() {
  localStorage.removeItem('hautoria_user');
  setAccessToken(null);
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Only trust cache when a JWT is present — otherwise admin API calls will 401.
    return getAccessToken() ? readCachedAdmin() : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      if (!isApiEnabled()) {
        clearAdminSession();
        setUser(null);
        setLoading(false);
        return;
      }
      if (!getAccessToken()) {
        clearAdminSession();
        setUser(null);
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
          clearAdminSession();
          setUser(null);
        }
      } catch {
        clearAdminSession();
        setUser(null);
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
      clearAdminSession();
      throw new Error('This account does not have admin access.');
    }
    if (!getAccessToken()) {
      throw new Error('Login succeeded but no access token was stored. Try again.');
    }
    setUser(signedIn);
    localStorage.setItem('hautoria_user', JSON.stringify(signedIn));
  };

  const logout = async () => {
    const { authService } = await import('../services/authService');
    await authService.signOut();
    clearAdminSession();
    setUser(null);
  };

  return (
    <Context.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user) && Boolean(getAccessToken()),
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
