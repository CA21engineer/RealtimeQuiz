import { Dispatch } from 'react';
import { GameStatusAction } from 'store/gameStatus';
import { ReceiverBase } from './ReceiverBase';
import { GameRoomStatusData } from '../interfaces/Status';

export class Receiver extends ReceiverBase {
  private gameStatusDispatch: Dispatch<GameStatusAction>;

  constructor(dispatch: Dispatch<GameStatusAction>) {
    super();
    this.gameStatusDispatch = dispatch;
  }

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
    this.gameStatusDispatch({
      type: 'UPDATE_STATUS',
      payload: {
        status: data,
      },
    });
  }

  /**
   * 強制解答送信要求が送られてきた時
   * 管理者が解答締め切りボタンを押した時
   */
  forceSendAnswer(): void {
    this.gameStatusDispatch({
      type: 'EMIT_FORCE_ANSWER',
    });
  }
}
