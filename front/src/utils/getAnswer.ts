import { GameRoomStatusData } from 'interfaces/Status';

export const getAnswerWithPlayer = (
  status: GameRoomStatusData['currentStatus'],
  isAnswered: boolean,
  answer: string
): string => {
  if (['OPEN_ANSWER', 'OPEN_AGGREGATE'].includes(status)) {
    return answer || '未解答';
  }

  if (isAnswered || status === 'CLOSE_ANSWER') {
    return '解答済み';
  }

  return '解答中...';
};

export const getAnswerWithAdmin = (
  status: GameRoomStatusData['currentStatus'],
  isAnswered: boolean,
  answer: string
): string => {
  if (['OPEN_ANSWER', 'OPEN_AGGREGATE', 'CLOSE_ANSWER'].includes(status)) {
    return answer || '未解答';
  }

  if (isAnswered) {
    return answer;
  }

  return '解答中...';
};
