export interface StatusData {
    // ゲームの状態を示す
    currentStatus: 'WAITING_QUESTION' | 'CLOSE_ANSWER' | 'OPEN_ANSWER' | 'OPEN_AGGRIGATE';

    // 今の問題
    currentQuestion: string | null

    players: PlayerStatus[],
}

export interface PlayerStatus {
    id: string,
    name: string,
    isAdmin: boolean,
    isSpectator: boolean,
    stars: number,
    answer: string | null,
    isAnswered: boolean,
    alterStars: number,
}