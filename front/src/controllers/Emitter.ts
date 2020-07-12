import { SetAlterStarsPayload } from '../interfaces/SetAlterStars';

export class Emitter {
    constructor(private emitter: (type: string, data?: any) => void) { }

    // 名前を変更する
    public changeName(newName: string) {
        this.emitter('changeName', newName);
    }

    // 問題を送信する
    public setQuestion(question: string) {
        this.emitter('setQuestion', question);
    }

    // 一斉に問題をオープンする
    public openAnswers() {
        this.emitter('openAnswers');
    }

    // 解答を送信する
    public setAnswer(question: string) {
        this.emitter('setAnswer', question);
    }

    // 変化させる星の数を設定する
    public setAlterStars(alterStars: SetAlterStarsPayload) {
        this.emitter('setAlterStars', alterStars);
    }

    // 次の問題を出題する
    public goToNextQuestion() {
        this.emitter('goToNextQuestion');
    }
}