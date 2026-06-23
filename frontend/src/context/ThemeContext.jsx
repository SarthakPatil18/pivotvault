import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'apple', toggleTheme: () => {}, setTheme: () => {} });

const STORAGE_KEY = 'pivotvault-theme';

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'apple';
    return localStorage.getItem(STORAGE_KEY) || 'apple';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (t) => setThemeState(t === 'cursor' ? 'cursor' : 'apple');
  const toggleTheme = () => setThemeState((t) => (t === 'apple' ? 'cursor' : 'apple'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
