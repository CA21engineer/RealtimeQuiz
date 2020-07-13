import React from 'react';
import { GameStatusContextWrapper } from './gameStatus';

export const Store: React.FC<{ children: React.ReactChild }> = ({
  children,
}) => {
  return <GameStatusContextWrapper>{children}</GameStatusContextWrapper>;
};
