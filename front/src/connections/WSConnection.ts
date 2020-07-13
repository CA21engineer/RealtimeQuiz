import { Connection } from './Connection';

/*
 * WebSocket利用時の差分を吸収する
 * (将来的にSocketIO, ロングポーリングなんかもあるかもしれないため)
 */

export class WSConnection extends Connection {
  private socket: WebSocket;

  constructor(destination: string) {
    super();

    this.socket = new WebSocket(destination);

    this.socket.addEventListener('open', () => {
      this.callFunction('open', null);
    });

    this.socket.addEventListener('onerror', () => {
      throw new Error('接続できませんでした');
    });

    this.setMessageHandler();
  }

  // データを送信する
  public emitData(type: string, data: unknown): void {
    this.socket.send(JSON.stringify({ type, data }));
  }

  // ハンドラを設定し親クラスのcallFunctionを呼び出す
  private setMessageHandler(): void {
    this.socket.addEventListener('message', (event) => {
      const json = JSON.parse(event.data);
      this.callFunction(json.type, json);
    });
  }
}
