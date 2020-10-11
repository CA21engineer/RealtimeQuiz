import { Dispatch } from 'react';
import {
  updateGameRoomStatus,
  emitForceAnswer,
  Actions,
} from 'acitons/gameStatus';
import { ReceiverBase } from './ReceiverBase';
import { GameRoomStatusData } from '../interfaces/Status';

export class Receiver extends ReceiverBase {
  private gameStatusDispatch: Dispatch<Actions>;

  constructor(dispatch: Dispatch<Actions>) {
    super();
    this.gameStatusDispatch = dispatch;
  }

  callHandler(type: string, data: unknown): boolean {
    switch (type) {
      case 'Status':
      case 'PlayerList': {
        this.onStatusChanged(data as GameRoomStatusData);
        return true;
      }
      case 'ForceSendAnswer':
        this.forceSendAnswer();
        return true;
      default:
        return false;
    }
  }

  /**
   * なんらかのステータスが変更された
   * => 問題が出題された
   * => 誰かの名前が変更された
   * => 誰かが入室した
   * => 誰かが退出した etc...
   */
  onStatusChanged(data: GameRoomStatusData): void {
    this.gameStatusDispatch(updateGameRoomStatus(data));
  }

  /**
   * 強制解答送信要求が送られてきた時
   * 管理者が解答締め切りボタンを押した時
   */
  forceSendAnswer(): void {
    this.gameStatusDispatch(emitForceAnswer());
  }
}
