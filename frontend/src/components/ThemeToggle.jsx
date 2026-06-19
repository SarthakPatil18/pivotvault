import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'blue' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="pv-btn-ghost pv-btn-icon"
    >
      {theme === 'blue' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
