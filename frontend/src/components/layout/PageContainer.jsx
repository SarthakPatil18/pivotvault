import React from 'react';
import { clsx } from 'clsx';

export default function PageContainer({ as: Component = 'div', className, children, ...props }) {
  return (
    <Component className={clsx('pv-content-container', className)} {...props}>
      {children}
    </Component>
  );
}
