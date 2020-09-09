import { Dispatch, SetStateAction } from 'react';
import { GameStatusDispatch } from 'store/gameStatus';

export const clearReduceTimer = (
  id: NodeJS.Timeout,
  setTimerId: Dispatch<SetStateAction<NodeJS.Timeout | undefined>>,
  gameStatusDispatch: GameStatusDispatch
) => {
  clearInterval(id);
  setTimerId(undefined);
  gameStatusDispatch({
    type: 'SWITCH_COUNT_DOWN_TIMER',
    payload: {
      personalStatus: {
        isStartCountdownTimer: false,
      },
    },
  });
};
