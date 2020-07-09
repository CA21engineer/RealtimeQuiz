<template>
  <div class="room-view">
    <h2>問題</h2>
    <div>
      No: <label><input v-model.number="quiz.no" type="number"></label><br>
      問題文: <label><input v-model="quiz.content" placeholder="content"></label><br>
      点数: <label><input v-model.number="quiz.points" type="number"></label><br>
      <button @click="onClickQuiz">出題する</button>
    </div>

    <h2>あなた</h2>
    点数: {{ temporaryData.points }} | {{ name }}<br>
    ニックネーム: <label><input v-model="name" placeholder="content"></label> | <button @click="onClickRename">変更</button>

    <h2>自分の回答</h2>
    <div>
      回答: <label><input v-model="temporaryData.answer" placeholder="content"></label><br>
      <button @click="onClickAnswer">回答を提出する</button>
    </div>

    <h2>みんなの回答</h2>
    <div v-for="item in answers" :key="item.from">
      {{ item.from }} - {{ item.content }}<br>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import RestAPI, { Room } from '@/lib/restapi'
import RealtimeAPI, {
  ConnectionClosed,
  ConnectionOpened,
  CorrectAnswer,
  Quiz,
  TemporaryData,
  Account, AnswerWithSender
} from '@/lib/realtimeapi'

@Component({
  components: {}
})
export default class RoomView extends Vue {
  restAPI!: RestAPI
  realtimeAPI!: RealtimeAPI
  accountId!: string
  name!: string

  quiz!: Quiz

  temporaryData!: TemporaryData
  accounts!: Map<string, Account>
  correctAnswer!: CorrectAnswer

  init () {
    this.quiz = { no: 1, content: '', points: 1 }
    this.temporaryData = { answer: '', points: 0 }
    this.accounts = new Map<string, Account>()
    this.correctAnswer = { content: '', points: 1 }
  }

  async created () {
    this.init()
    let accountId = localStorage.getItem('accountId')
    let accountName = localStorage.getItem('accountName')
    if (!accountId) {
      accountId = this.uuidv4()
      localStorage.setItem('accountId', accountId)
    }
    if (!accountName) {
      accountName = 'DefaultName'
      localStorage.setItem('accountName', accountName)
    }
    this.accountId = accountId
    this.name = accountName
    this.restAPI = new RestAPI(accountId, accountName)
    this.realtimeAPI = new RealtimeAPI(accountId, accountName)

    this.realtimeAPI.quizHandler = (message: Quiz) => {
      alert('問題が出題されました！')
      this.init()
      this.quiz = message
    }
    this.realtimeAPI.answerHandler = (message: AnswerWithSender) => {
      let account = this.accounts.get(message.accountId)
      if (account) {
        account.answer.content = message.content
      } else {
        account = { accountId: message.accountId, accountName: '', answer: { content: message.content } }
      }
      this.accounts.set(message.accountId, account)
    }
    this.realtimeAPI.correctAnswerHandler = (message: CorrectAnswer) => { console.log(message) }
    this.realtimeAPI.temporaryDataHandler = (message: TemporaryData) => {
      this.temporaryData = message
    }
    this.realtimeAPI.connectionOpenedHandler = (message: ConnectionOpened) => {
      this.name = 'aaaaaaaa'
      if (message.accountId === this.accountId) {
        this.name = message.name
        return
      }
      alert(`${message.name}が参加したよ！`)
      let account = this.accounts.get(message.accountId)
      if (account) {
        account.accountId = message.accountId
        account.accountName = message.name
      } else {
        account = { accountId: message.accountId, accountName: message.name, answer: { content: '' } }
      }
      this.accounts.set(message.accountId, account)
    }
    this.realtimeAPI.connectionClosedHandler = (message: ConnectionClosed) => {
      // alert(`${message.name}が退室したよ！`)
      this.accounts.delete(message.accountId)
    }

    const roomId = this.$route.params.roomId
    this.realtimeAPI.connect(roomId)
  }

  onClickQuiz () {
    this.realtimeAPI.quiz(this.quiz)
  }

  onClickAnswer () {
    this.realtimeAPI.answer({ content: this.temporaryData.answer })
  }

  onClickCorrectAnswer () {
    this.realtimeAPI.correctAnswer(this.correctAnswer)
  }

  onClickRename () {
    this.restAPI.accountName = this.name
    this.realtimeAPI.accountName = this.name
    this.realtimeAPI.rename({ name: this.name })
  }

  private uuidv4 () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}
</script>
