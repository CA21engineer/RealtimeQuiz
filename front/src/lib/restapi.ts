// @ts-ignore
import axios, { AxiosResponse } from 'axios'
import Logger, {LEVEL} from './logger'


export default class RestAPI {
  logger!: Logger
  private endpoint: string = window.location.origin + '/api'
  accountId!: string
  accountName!: string

  constructor(accountId: string, accountName: string) {
    this.logger = new Logger("RestAPI")
    if (process.env.NODE_ENV === 'production') {
      this.logger.level = LEVEL.LOG
    } else {
      this.logger.level = LEVEL.FULL
    }

    this.accountId = accountId
    this.accountName = accountName
  }

  getRooms(): Promise<GetRoomsSuccess> {
    return axios({
      url: `${this.endpoint}/room`,
      method: 'get'
    })
      .then((res: AxiosResponse) => res.data)
  }

  createRoom(): Promise<CreateRoomSuccess> {
    return axios({
      url: `${this.endpoint}/room/accountId/${this.accountId}/name/${this.accountName}`,
      method: 'post'
    })
      .then((res: AxiosResponse) => res.data)
  }

}


export type Room = {
  roomId: string
  participants: number
}

export type GetRoomsSuccess = Array<Room>

export type CreateRoomSuccess = {
  roomId: string
}
