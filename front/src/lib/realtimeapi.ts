import Logger, {LEVEL} from './logger'


export default class RealtimeAPI {
  logger!: Logger
  private endpoint: string = `${window.location.host.includes('localhost') ? 'ws' : 'wss'}://${window.location.host}/ws`
  accountId!: string
  accountName!: string

  socket?: WebSocket

  quizHandler: (message: Quiz) => void = () => {}
  answerHandler: (message: AnswerWithSender) => void = () => {}
  correctAnswerHandler: (message: CorrectAnswer) => void = () => {}
  temporaryDataHandler: (message: TemporaryData) => void = () => {}
  connectionOpenedHandler: (message: ConnectionOpened) => void = () => {}
  connectionClosedHandler: (message: ConnectionClosed) => void = () => {}

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
      this.logger.log(`message: ${json}`)

      if (json.ConnectionOpened) {
        const message = json.ConnectionOpened as ConnectionOpened
        this.connectionOpenedHandler(message)
      } else if (json.ConnectionClosed) {
        const message = json.ConnectionClosed as ConnectionClosed
        this.connectionClosedHandler(message)
      } else if (json.TemporaryData) {
        const message = json.TemporaryData as TemporaryData
        this.temporaryDataHandler(message)
      } else if (json.Quiz) {
        const message = json.Quiz as Quiz
        this.quizHandler(message)
      } else if (json.AnswerWithSender) {
        const message = json.AnswerWithSender as AnswerWithSender
        this.answerHandler(message)
      } else if (json.CorrectAnswer) {
        const message = json.CorrectAnswer as CorrectAnswer
        this.correctAnswerHandler(message)
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
  rename(message: ReName) {
    this.socket?.send(JSON.stringify(message))
  }
}

// Receive
export type ConnectionOpened = {
  accountId: string
  name: string
}
export type ConnectionClosed = {
  accountId: string
  name: string
}
export type ParseError = {
  org: string
}
export type TemporaryData = {
  answer: string
  points: number
}

// Send & Receive
export type Quiz = {
  no: number
  content: string
  points: number
}
export type AnswerWithSender = {
  accountId: string
  content: string
}
export type CorrectAnswer = {
  content: string
  points: number
}

// Send
export type Answer = {
  content: string
}
export type ReName = {
  name: string
}


export type Account = {
  accountId: string
  accountName: string
  answer: Answer
}
