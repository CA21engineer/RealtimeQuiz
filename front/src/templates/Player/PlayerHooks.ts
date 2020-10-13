import { useContext, useState, useEffect, useRef } from 'react';
import useSound from 'use-sound';
import { getSoundSource } from 'utils/sound';
import { clearReduceTimer } from 'utils/timer';
import { GameStatusContext, RoomStatus } from 'store/gameStatus';
import { UserContext } from 'store/user';
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
  const gameStatus = useContext(GameStatusContext);
  const alterStars =
    gameStatus.state.personalStatus.currentStatus?.alterStars ?? 0;
  const { currentStatus } = gameStatus.state.roomStatus;

  const user = useContext(UserContext);
  const { volume } = user.state.setting;

  const prevRoomStatus = useRef<RoomStatus['currentStatus']>(currentStatus);

  const [playQuestionSound] = useSound(getSoundSource('QUESTION'), { volume });
  const [playCorrectSound] = useSound(getSoundSource('CORRECT'), { volume });
  const [playIncorrectSound] = useSound(getSoundSource('INCORRECT'), {
    volume,
  });

  useEffect(() => {
    if (volume <= 0 || Number.isNaN(volume)) {
      return;
    }

    if (
      prevRoomStatus.current === 'WAITING_QUESTION' &&
      currentStatus === 'WAITING_ANSWER'
    ) {
      playQuestionSound();
      return;
    }

    if (
      prevRoomStatus.current === 'OPEN_ANSWER' &&
      currentStatus === 'OPEN_AGGREGATE'
    ) {
      if (alterStars <= 0) {
        playIncorrectSound();
        return;
      }

      playCorrectSound();
    }
  });

  useEffect(() => {
    prevRoomStatus.current = currentStatus;
  });

  return {
    gameStatus,
    user,
    clearReduceTimer,
    reduceTimerid,
    setReduceTimerId,
    expressPlayerStatus,
  };
};
