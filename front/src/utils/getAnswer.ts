import { GameRoomStatusData } from 'interfaces/Status';

export const getAnswerWithPlayer = (
  status: GameRoomStatusData['currentStatus'],
  isAnswered: boolean,
  answer: string
): string => {
  if (['OPEN_ANSWER', 'OPEN_AGGREGATE'].includes(status)) {
    return answer;
  }
  if (isAnswered) {
    return '解答済み';
  }

  return '解答中...';
};

export const getAnswerWithAdmin = (
  isAnswered: boolean,
  answer: string
): string => {
  if (isAnswered) {
    return answer;
  }

  return '解答中...';
};
