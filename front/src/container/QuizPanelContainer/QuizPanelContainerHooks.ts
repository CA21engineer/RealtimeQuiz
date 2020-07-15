import { useContext } from 'react';
import { GameStatusContext } from 'store/gameStatus';
import { getPlusMinus } from 'utils/getPlusMinus';

export function useQuizPanelContainer() {
  const { roomStatus, personalStatus } = useContext(GameStatusContext).state;

  return {
    roomStatus,
    personalStatus,
    getPlusMinus,
  };
}
