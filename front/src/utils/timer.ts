import React from 'react';
import { setCountDownTimer } from 'acitons/gameStatus';
import { GameStatusDispatch } from 'store/gameStatus';

export const clearReduceTimer = (
  id: NodeJS.Timeout,
  setTimerId: React.Dispatch<React.SetStateAction<NodeJS.Timeout | undefined>>,
  gameStatusDispatch: GameStatusDispatch
) => {
  clearInterval(id);
  setTimerId(undefined);
  gameStatusDispatch(setCountDownTimer(false));
};
