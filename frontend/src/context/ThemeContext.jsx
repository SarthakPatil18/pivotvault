import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'beige', toggleTheme: () => {}, setTheme: () => {} });

const STORAGE_KEY = 'pivotvault-theme';

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'beige';
    // Convert old theme names ('apple', 'cursor') to new ones ('beige', 'blue')
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'apple') return 'beige';
    if (saved === 'cursor') return 'blue';
    return saved || 'beige';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (t) => setThemeState(t === 'blue' ? 'blue' : 'beige');
  const toggleTheme = () => setThemeState((t) => (t === 'beige' ? 'blue' : 'beige'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
