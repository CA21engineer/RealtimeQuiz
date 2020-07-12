import { ReceiverBase } from './ReceiverBase';
import { GameRoomStatusData } from '../interfaces/Status';

export class Receiver extends ReceiverBase {
    callHandler(type: string, data: unknown) {
        if (type === 'status') {
            const statusData = data as GameRoomStatusData;
            this.onStatusChanged(statusData);
            return true;
        } else if (type === 'forceSendAnswer') {
            this.forceSendAnswer();
            return true;
        } else if (type === 'open') {
            this.joinedRoom();
            return true;
        }

        return false;
    }

    // ルームに正常に入室した
    joinedRoom() {

    }

    /**
     * なんらかのステータスが変更された
     * => 問題が出題された
     * => 誰かの名前が変更された
     * => 誰かが入室した
     * => 誰かが退出した etc...
     */
    // @ts-ignore
    onStatusChanged(data: GameRoomStatusData) {
        //
    }

    /**
     * 強制解答送信要求が送られてきた
     * 管理者が解答締め切りボタンを押した時
     */
    forceSendAnswer() {
        //
    }
}