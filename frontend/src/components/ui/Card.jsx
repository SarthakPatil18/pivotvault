import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useDesignSystem } from '../../lib/design-system';

export const Card = ({ as: Component = 'div', variant = 'default', className, ...props }) => {
  const { isBeige, colors, radius, spacing } = useDesignSystem();

  const baseClasses = isBeige ? 'p-apple-lg md:p-apple-xl' : 'p-cursor-lg md:p-cursor-xl';
  
  const variantsClasses = {
    default: clsx(
      colors.surface,
      colors.border,
      'border',
      radius.card
    ),
    muted: clsx(
      colors.surface2,
      radius.card
    ),
    interactive: clsx(
      colors.surface,
      colors.border,
      'border cursor-pointer hover:border-opacity-80 transition-colors',
      radius.card
    ),
  };

  return (
    <Component 
      className={twMerge(clsx(baseClasses, variantsClasses[variant], className))} 
      {...props} 
    />
  );
};

export default Card;
