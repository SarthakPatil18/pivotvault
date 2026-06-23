import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isBeige = theme === 'beige' || theme === 'apple';

  return (
    <Button
      variant="ghost"
      size="sm"
      iconOnly
      onClick={toggleTheme}
      aria-label={isBeige ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {isBeige ? <Moon size={20} /> : <Sun size={20} />}
    </Button>
  );
}
