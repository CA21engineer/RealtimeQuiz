export interface GameRoomStatusData {
  // ゲームの状態を示す
  currentStatus:
    | 'WAITING_QUESTION'
    | 'WAITING_ANSWER'
    | 'CLOSE_ANSWER'
    | 'OPEN_ANSWER'
    | 'OPEN_AGGREGATE';

  // 今の問題
  currentQuestion: string | null;

  // 今の問題の正解(任意)
  currentCorrectAnswer: string | null;

  // 今の制限時間 nullの時は制限時間なし
  currentTime: number | null;

  players: PlayerStatus[];
}

export interface PlayerStatus {
  id: string;
  name: string;
  role: 'admin' | 'player';
  stars: number;
  answer: string | null;
  isAnswered: boolean;
  alterStars: number;
  connectionStatus: 'online' | 'offline';
}
