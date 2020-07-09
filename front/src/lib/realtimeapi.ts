import Logger, {LEVEL} from './logger'


export default class RealtimeAPI {
  logger!: Logger
  private endpoint: string = `${window.location.host.includes('localhost') ? 'ws' : 'wss'}://${window.location.host}/ws`
  accountId!: string
  accountName!: string

  socket?: WebSocket

  quizHandler: (from: string, message: Quiz) => void = () => {}
  answerHandler: (from: string, message: Answer) => void = () => {}
  correctAnswerHandler: (from: string, message: CorrectAnswer) => void = () => {}
  connectionOpenedHandler: (from: string, message: ConnectionOpened) => void = () => {}
  connectionClosedHandler: (from: string, message: ConnectionClosed) => void = () => {}

  constructor(accountId: string, accountName: string) {
    this.logger = new Logger("RealtimeAPI")
    if (process.env.NODE_ENV === 'production') {
      this.logger.level = LEVEL.LOG
    } else {
      this.logger.level = LEVEL.FULL
    }

    this.accountId = accountId
    this.accountName = accountName
  }

  connect(roomId: string) {
    this.socket = new WebSocket(`${this.endpoint}/room/${roomId}/accountId/${this.accountId}/name/${this.accountName}`)
    this.socket.addEventListener('open', (e: Event) => {
      this.logger.log('open')
    })
    this.socket.addEventListener('message', (e: MessageEvent) => {
      const json = JSON.parse(e.data)
      const from = json.from
      this.logger.log(`from: ${from}, message: ${json}`)

      if (json.ConnectionOpened) {
        const message = json.ConnectionOpened as ConnectionOpened
        this.connectionOpenedHandler(from, message)
      } else if (json.ConnectionClosed) {
        const message = json.ConnectionClosed as ConnectionClosed
        this.connectionClosedHandler(from, message)
      } else if (json.Quiz) {
        const message = json.Quiz as Quiz
        this.quizHandler(from, message)
      } else if (json.Answer) {
        const message = json.Answer as Answer
        this.answerHandler(from, message)
      } else if (json.CorrectAnswer) {
        const message = json.CorrectAnswer as CorrectAnswer
        this.correctAnswerHandler(from, message)
      } else {
        const message: ParseError = { org: e.data }
      }
    })
    this.socket.addEventListener('close', (e: CloseEvent) => {
      this.logger.error(e)
    })
    this.socket.addEventListener('error', (e: Event) => {
      this.logger.error(e)
    })
  }

  quiz(message: Quiz) {
    this.socket?.send(JSON.stringify(message))
  }
  answer(message: Answer) {
    this.socket?.send(JSON.stringify(message))
  }
  correctAnswer(message: CorrectAnswer) {
    this.socket?.send(JSON.stringify(message))
  }
}

export type ConnectionOpened = {
  accountId: string
  name: string
}
export type ConnectionClosed = {
  accountId: string
  name: string
}

export type Quiz = {
  no: number
  content: string
  points: number
}

export type Answer = {
  content: string
}

export type CorrectAnswer = {
  content: string
  points: number
}
export type ParseError = {
  org: string
}
