import { useContext } from 'react';
import { GameStatusContext } from 'store/gameStatus';

export function useQuizPanelContainer() {
  const { roomStatus, personalStatus } = useContext(GameStatusContext).state;

  const getPlusMinus = (alterStars: number) => {
    if (alterStars > 0) {
      return 'Plus';
    }

    if (alterStars < 0) {
      return 'Minus';
    }
    return 'None';
  };

  return {
    roomStatus,
    personalStatus,
    getPlusMinus,
  };
}
