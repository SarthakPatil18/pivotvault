import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useDesignSystem } from '../lib/design-system';

export const Section = ({ 
  as: Component = 'section', 
  variant = 'default',
  className, 
  children, 
  ...props 
}) => {
  const { isApple, spacing } = useDesignSystem();

  const variants = {
    default: isApple ? 'bg-apple-canvas' : 'bg-cursor-canvas',
    parchment: isApple ? 'bg-apple-canvas-parchment' : 'bg-cursor-canvas-soft',
    dark: isApple ? 'bg-apple-surface-tile-1 text-apple-body-dark' : 'bg-cursor-surface-card',
  };

  return (
    <Component 
      className={twMerge(clsx(spacing.section, variants[variant], className))} 
      {...props} 
    >
      <div className="container mx-auto px-4 md:px-8">
        {children}
      </div>
    </Component>
  );
};

export default Section;
