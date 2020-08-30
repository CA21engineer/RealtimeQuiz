import { Dispatch } from 'react';
import { GameStatusAction } from 'store/gameStatus';
import { ReceiverBase } from './ReceiverBase';
import { GameRoomStatusData } from '../interfaces/Status';
import { TimeLimit } from "../../timer/TimeLimit";

export class Receiver extends ReceiverBase {
  private gameStatusDispatch: Dispatch<GameStatusAction>;

  constructor(dispatch: Dispatch<GameStatusAction>) {
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
    const timer = data.currentTime ? new TimeLimit(data.currentTime) : null;

    if (timer) {
      timer.onTimeChanged((currentTime) => {
        this.gameStatusDispatch({
          type: "UPDATE_STATUS",
          payload: {
            status: { ...data, currentTime }
          }
        });
      });
    }

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
