import { useContext } from 'react';
import { GameStatusContext } from 'store/gameStatus';

export function useQuizPanelContainer() {
  const { roomStatus, personalStatus } = useContext(GameStatusContext).state;

  return {
    roomStatus,
    personalStatus,
  };
}
