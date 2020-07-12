import React from 'react';
import { StatusContextWrapper } from './status';

export const Store: React.FC<{ children: React.ReactChild }> = ({
  children,
}) => {
  return <StatusContextWrapper>{children}</StatusContextWrapper>;
};
