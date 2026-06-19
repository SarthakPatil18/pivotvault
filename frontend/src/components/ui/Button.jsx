import React from 'react';
import { clsx } from 'clsx';

const variants = {
  primary: 'pv-btn-primary',
  secondary: 'pv-btn-secondary',
  ghost: 'pv-btn-ghost',
  danger: 'pv-btn-danger',
};

const sizes = {
  sm: 'h-control-sm px-3 text-xs',
  md: '',
  lg: 'h-control-lg px-5',
};

export const buttonClassName = ({ variant = 'primary', size = 'md', iconOnly = false, className } = {}) =>
  clsx(variants[variant] || variants.primary, sizes[size], iconOnly && 'pv-btn-icon', className);

export default function Button({ variant = 'primary', size = 'md', iconOnly = false, className, type = 'button', ...props }) {
  return <button type={type} className={buttonClassName({ variant, size, iconOnly, className })} {...props} />;
}
