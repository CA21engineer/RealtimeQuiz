import React from 'react';
import { GameStatusContextProvider } from './gameStatus';
import { UserContextProvider } from './user';

export const Store: React.FC<{ children: React.ReactChild }> = ({
  children,
}) => {
  return (
    <GameStatusContextProvider>
      <UserContextProvider>{children}</UserContextProvider>
    </GameStatusContextProvider>
  );
};
