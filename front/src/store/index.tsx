import React from 'react';
import { GameStatusContextProvider } from './gameStatus';

export const Store: React.FC<{ children: React.ReactChild }> = ({
  children,
}) => {
  return <GameStatusContextProvider>{children}</GameStatusContextProvider>;
};
