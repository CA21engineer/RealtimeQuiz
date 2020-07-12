import { ReceiverBase } from './ReceiverBase';
import { GameRoomStatusData } from '../interfaces/Status';

export class Receiver extends ReceiverBase {
  callHandler(type: string, data: unknown): boolean {
    switch (type) {
      case 'status':
        {
          const statusData = data as GameRoomStatusData;
          this.onStatusChanged(statusData);
        }
        return true;
      case 'forceSendAnswer':
        this.forceSendAnswer();
        return true;
      case 'open':
        this.joinedRoom();
        return true;
      default:
        return false;
    }
  }

  // ルームに正常に入室した
  joinedRoom(): void {
    // dummy for lint
    console.log(this);
  }

  /**
   * なんらかのステータスが変更された
   * => 問題が出題された
   * => 誰かの名前が変更された
   * => 誰かが入室した
   * => 誰かが退出した etc...
   */
  onStatusChanged(data: GameRoomStatusData): void {
    // dummy for lint
    console.log(this, data);
  }

  /**
   * 強制解答送信要求が送られてきた時
   * 一斉に解答オープンボタンを押した
   */
  forceSendAnswer(): void {
    // dummy for lint
    console.log(this);
  }
}
