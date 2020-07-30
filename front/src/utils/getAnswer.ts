import { GameRoomStatusData } from 'websocket/interfaces/Status';

export const getAnswerWithPlayer = (
  status: GameRoomStatusData['currentStatus'],
  isAnswered: boolean,
  answer: string
): string => {
  switch (status) {
    case 'OPEN_ANSWER':
    case 'OPEN_AGGREGATE': {
      return answer || '未解答';
    }

    case 'CLOSE_ANSWER': {
      return '解答済み';
    }

    case 'WAITING_QUESTION': {
      return '待機中...';
    }

    case 'WAITING_ANSWER': {
      return isAnswered ? '解答済み' : '解答中...';
    }

    default:
      return '';
  }
};

export const getAnswerWithAdmin = (
  status: GameRoomStatusData['currentStatus'],
  isAnswered: boolean,
  answer: string
): string => {
  switch (status) {
    case 'CLOSE_ANSWER':
    case 'OPEN_ANSWER':
    case 'OPEN_AGGREGATE': {
      return answer || '未解答';
    }

    case 'WAITING_QUESTION': {
      return '待機中...';
    }

    default:
      if (isAnswered) {
        return answer;
      }

      return '解答中...';
  }
};
