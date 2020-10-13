import { SetAlterStarsPayload } from '../interfaces/SetAlterStars';

export class Emitter {
  private emitter: (type: string, data?: unknown) => void;

  constructor(emitter: (type: string, data?: unknown) => void) {
    this.emitter = emitter;
  }

  // 名前を変更する
  public changeName(newName: string): void {
    this.emitter('ChangeName', {
      accountName: newName,
      // isSpectator: false,
    });
  }

  // 問題を送信する
  public setQuestion(
    question: string,
    timeLimit: number | null,
    correctAnswer: string | null
  ): void {
    this.emitter('SetQuestion', { question, timeLimit, correctAnswer });
  }

  // 一斉に問題をオープンする
  public openAnswers(): void {
    this.emitter('OpenAnswers');
  }

  // 解答を送信する
  public setAnswer(answer: string): void {
    this.emitter('SetAnswer', { answer });
  }

  // 変化させる星の数を設定する
  public setAlterStars(alterStars: SetAlterStarsPayload): void {
    this.emitter('SetAlterStars', alterStars);
  }

  // 次の問題を出題する
  public goToNextQuestion(): void {
    this.emitter('GoToNextQuestion');
  }

  // 解答を締め切る
  public closeApplications(): void {
    this.emitter('CloseApplications');
  }

  // リザルトへ移動する
  public GotoResult(): void {
    this.emitter('GoToResult');
  }
}
