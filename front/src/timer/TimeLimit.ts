export class TimeLimit {

  private currentTime = 0;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private callback: (currentTime: number) => void = () => { } ;

  constructor(timeLimit: number) {
    if (timeLimit <= 0) {
      throw new Error('タイムリミットが不正です');
    }

    const interval = setInterval(() => {
      this.currentTime -= 1;
      this.callback(this.currentTime);
      if (this.currentTime <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  // カウントダウン毎に呼ばれるコールバックを設定する
  public onTimeChanged(func: (currentTime: number) => void): void {
    this.callback = func;
  }
}
