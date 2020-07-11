import { ReceiverBase } from '../controllers/ReceiverBase';
import { Emitter } from '../controllers/Emitter';

export abstract class Connection {
    private receivers: ReceiverBase[] = [];

    // データ送信用
    abstract emitData(type: string, data: any): void;

    // レシーバーを登録する
    public setReceivers(receiver: ReceiverBase) {
        this.receivers.push(receiver);
    }

    // エミッターを作成する TODO: もう少しいい感じの設計をしたい
    public createEmitter() {
        return new Emitter((type: string, data?: any) => {
            this.emitData(type, data ? data : {});
        });
    }

    // typeに対して対応する関数を呼び出す
    public callFunction(type: string, data: unknown): void {
        const result = this.receivers.some((receiver) => {
            return receiver.callHandler(type, data);
        })

        if (!result) {
            console.warn('着信したメッセージは正常に処理されませんでした。', type, data);
        }
    }
}