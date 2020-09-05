import { getAccountId } from './AccountId';
import { RoomInformation } from '../interfaces/RoomList';
import { ConnectionInfo } from '../interfaces/ConnectionInfo';

/**
 * 現在あるルーム情報の配列を返す
 */
export const getRoomList = async (): Promise<RoomInformation[]> => {
  const { API_BASE_URL } = process.env;
  console.log(process.env);
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL環境変数が定義されていません');
  }

  const roomInformation = (await fetch(`${API_BASE_URL}room`).then((r) =>
    r.json()
  )) as unknown;

  return roomInformation as RoomInformation[];
};

/**
 * 新しいルームを作ってを取得する
 */
export const createNewRoomThenGetInfo = async (
  roomName: string
): Promise<ConnectionInfo> => {
  const { API_BASE_URL } = process.env;
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL環境変数が定義されていません');
  }

  const accountId = getAccountId();

  const roomInfo = ((await fetch(`${API_BASE_URL}room/accountId/${accountId}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ roomName }),
  }).then((r) => r.json())) as unknown) as RoomInformation;

  return {
    accountId,
    roomId: roomInfo.roomId,
  };
};
