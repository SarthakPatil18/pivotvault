import React from 'react';
import { clsx } from 'clsx';

export default function Card({ as: Component = 'div', variant = 'default', className, ...props }) {
  const variants = {
    default: 'pv-card',
    muted: 'pv-card-muted',
    interactive: 'pv-card-interactive',
  };

  return <Component className={clsx(variants[variant] || variants.default, className)} {...props} />;
}
