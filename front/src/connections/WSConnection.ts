import { Connection } from './Connection';
import { ConnectionInfo } from '../interfaces/ConnectionInfo';
import { WS_BASE_URL } from '../configurations/Config';

/*
 * WebSocket利用時の差分を吸収する
 * (将来的にSocketIO, ロングポーリングなんかもあるかもしれないため)
 */

export class WSConnection extends Connection {
  private socket: WebSocket;

  private url: string;

  constructor(connectionInfo: ConnectionInfo) {
    super();

    this.url = `${WS_BASE_URL}room/${connectionInfo.roomId}/accountId/${connectionInfo.accountId}`;
    this.socket = new WebSocket(this.url);

    this.setEventHandlers();
  }

  // 再接続
  private connect() {
    this.socket = new WebSocket(this.url)
    this.setEventHandlers();
  }

  // データを送信する
  public emitData(type: string, data: unknown): void {
    this.socket.send(JSON.stringify({ type, data }));
  }

  // ハンドラを設定し親クラスのcallFunctionを呼び出す
  private setEventHandlers(): void {
    this.socket.addEventListener('open', () => {
      console.log('コネクション確立');
      this.callFunction('open', null);
    });

    this.socket.addEventListener('onerror', () => {
      throw new Error('接続できませんでした');
    });

    this.socket.addEventListener('onclose', () => {
      console.log('コネクションが切断されたため再度接続を試みます...');
      this.connect();
    })

    this.socket.addEventListener('message', (event) => {
      const json = JSON.parse(event.data);
      this.callFunction(json.type, json.data);
    });
  }
}
