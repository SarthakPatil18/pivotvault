import React from 'react';
import { clsx } from 'clsx';

export function Table({ className, ...props }) {
  return <table className={clsx('pv-table', className)} {...props} />;
}

export function TableWrap({ className, ...props }) {
  return <div className={clsx('pv-table-wrap', className)} {...props} />;
}
