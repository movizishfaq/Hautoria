import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeCtx = { isDark: boolean; toggle: () => void };

const Context = createContext<ThemeCtx | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('hautoria_admin_theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('hautoria_admin_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <Context.Provider value={{ isDark, toggle: () => setIsDark((d) => !d) }}>
      <div className="admin-root" data-admin-theme={isDark ? 'dark' : 'light'}>
        {children}
      </div>
    </Context.Provider>
  );
}

export function useAdminTheme() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useAdminTheme must be used inside AdminThemeProvider');
  return ctx;
}
