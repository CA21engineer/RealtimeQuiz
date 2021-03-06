import { Connection } from './Connection';
import { ConnectionInfo } from '../interfaces/ConnectionInfo';

/*
 * WebSocket利用時の差分を吸収する
 * (将来的にSocketIO, ロングポーリングなんかもあるかもしれないため)
 */

let currentWSConnection: WSConnection | null = null;
export const createWSConnection = (connectionInfo: ConnectionInfo) => {
  if (currentWSConnection) {
    currentWSConnection.close();
  }

  currentWSConnection = new WSConnection(connectionInfo);
  return currentWSConnection;
}

class WSConnection extends Connection {
  private socket: WebSocket;

  private url: string;

  constructor(connectionInfo: ConnectionInfo) {
    super();

    const { WS_BASE_URL } = process.env;
    if (!WS_BASE_URL) {
      throw new Error('WS_BASE_URL環境変数が定義されていません');
    }
    this.url = `${WS_BASE_URL}room/${connectionInfo.roomId}/accountId/${connectionInfo.accountId}`;
    this.socket = new WebSocket(this.url);

    this.setEventHandlers();
  }

  // 再接続
  private connect() {
    this.socket = new WebSocket(this.url);
    this.setEventHandlers();
  }

  // データを送信する
  public emitData(type: string, data: unknown): void {
    this.socket.send(JSON.stringify({ type, data }));
  }

  public close(): void {
    this.socket.onclose = null;
    this.socket.close();
  }

  // ハンドラを設定し親クラスのcallFunctionを呼び出す
  private setEventHandlers(): void {
    this.socket.addEventListener('open', () => {
      console.log('コネクション確立');
      this.callFunction('open', null);
    });

    this.socket.addEventListener('error', () => {
      throw new Error('接続できませんでした');
    });

    this.socket.onclose = () => {
      console.log('コネクションが切断されたため再度接続を試みます...');
      this.connect();
    }

    this.socket.addEventListener('message', (event) => {
      const json = JSON.parse(event.data);
      this.callFunction(json.type, json.data);
    });
  }
}
