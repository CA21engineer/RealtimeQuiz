export abstract class ReceiverBase {
  /**
   * @return bool このコントローラで処理が行われたかどうか
   */
  abstract callHandler(type: string, data: unknown): boolean;
}
