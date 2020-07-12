export interface GameRoomStatusData {
    // ゲームの状態を示す
    currentStatus: 'WAITING_QUESTION' | 'CLOSE_ANSWER' | 'OPEN_ANSWER' | 'OPEN_AGGRIGATE';

    // 今の問題
    currentQuestion: string | null

    players: PlayerStatus[],
}

export interface PlayerStatus {
    id: string,
    name: string,
    role: 'admin' | 'player' | 'spectator',
    stars: number,
    answer: string | null,
    isAnswered: boolean,
    alterStars: number,
    connectionStatus: 'online' | 'offline',
}