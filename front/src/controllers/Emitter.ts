import { SetAlterStarsPayload } from '../interfaces/SetAlterStars';

export class Emitter {
  private emitter: (type: string, data?: unknown) => void;

  constructor(emitter: (type: string, data?: unknown) => void) {
    this.emitter = emitter;
  }

  // 名前を変更する
  public changeName(newName: string): void {
    this.emitter('changeName', newName);
  }

  // 問題を送信する
  public setQuestion(question: string): void {
    this.emitter('setQuestion', question);
  }

  // 一斉に問題をオープンする
  public openAnswers(): void {
    this.emitter('openAnswers');
  }

  // 解答を送信する
  public setAnswer(question: string): void {
    this.emitter('setAnswer', question);
  }

  // 変化させる星の数を設定する
  public setAlterStars(alterStars: SetAlterStarsPayload): void {
    this.emitter('setAlterStars', alterStars);
  }

  // 次の問題を出題する
  public goToNextQuestion(): void {
    this.emitter('goToNextQuestion');
  }
}
