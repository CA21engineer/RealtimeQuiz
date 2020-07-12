import { ViewStatus } from '../../types/ViewStatus';

export function expressRoomStatus(status: ViewStatus): string {
  switch (status) {
    case ViewStatus.WAITING_QUESTION:
      return '出題を待っています…';
    default:
      throw new Error('Fatal: ユーザの状態が不明です．');
  }
}
