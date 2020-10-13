import { useContext, useState } from 'react';
import { clearReduceTimer } from 'utils/timer';
import { GameStatusContext } from 'store/gameStatus';

export const useAdminRoom = () => {
  const [reduceTimerid, setReduceTimerId] = useState<NodeJS.Timeout>();
  const { state, dispatch } = useContext(GameStatusContext);

  return {
    state,
    dispatch,
    clearReduceTimer,
    reduceTimerid,
    setReduceTimerId,
  };
};
