import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isApple = theme === 'apple';

  return (
    <Button
      variant="ghost"
      size="sm"
      iconOnly
      onClick={toggleTheme}
      aria-label={isApple ? 'Switch to Cursor theme' : 'Switch to Apple theme'}
    >
      {isApple ? <Moon size={20} /> : <Sun size={20} />}
    </Button>
  );
}
