import { useContext, useState } from 'react';
import { clearReduceTimer } from 'utils/timer';
import { GameStatusContext } from 'store/gameStatus';
import { GameRoomStatusData } from 'websocket/interfaces/Status';

function expressPlayerStatus(
  status: GameRoomStatusData['currentStatus']
): string {
  switch (status) {
    case 'WAITING_QUESTION':
      return '出題を待っています…';
    case 'WAITING_ANSWER':
      return '解答を受け付けています…';
    case 'CLOSE_ANSWER':
      return '解答オープンを待っています…';
    case 'OPEN_ANSWER':
      return '結果発表を待っています…';
    case 'OPEN_AGGREGATE':
      return '結果発表';
    default:
      throw new Error(`Fatal: ユーザの状態が不明です．: ${status}`);
  }
}

export const usePlayer = () => {
  const [reduceTimerid, setReduceTimerId] = useState<NodeJS.Timeout>();
  const { state, dispatch } = useContext(GameStatusContext);

  return {
    state,
    dispatch,
    clearReduceTimer,
    reduceTimerid,
    setReduceTimerId,
    expressPlayerStatus,
  };
};
