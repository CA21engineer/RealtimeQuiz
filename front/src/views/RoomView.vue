<template>
  <div class="room-view">
    <h2>問題</h2>
    <div>
      No: <label><input v-model.number="quiz.no" type="number"></label><br>
      問題文: <label><input v-model="quiz.content" placeholder="content"></label><br>
      点数: <label><input v-model.number="quiz.points" type="number"></label><br>
      <button @click="onClickQuiz">出題する</button>
    </div>

    <h2>自分の回答</h2>
    <div>
      回答: <label><input v-model="myAnswer.content" placeholder="content"></label><br>
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
import RealtimeAPI, { Answer, ConnectionClosed, ConnectionOpened, CorrectAnswer, Quiz } from '@/lib/realtimeapi'

@Component({
  components: {}
})
export default class RoomView extends Vue {
  restAPI!: RestAPI
  realtimeAPI!: RealtimeAPI
  quiz!: Quiz
  myAnswer!: Answer
  answers!: Array<AnswerWithSender>
  correctAnswer!: CorrectAnswer

  init () {
    this.quiz = { no: 1, content: '', points: 1 }
    this.myAnswer = { content: '' }
    this.answers = []
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
    this.restAPI = new RestAPI(accountId, accountName)
    this.realtimeAPI = new RealtimeAPI(accountId, accountName)

    this.realtimeAPI.quizHandler = (from: string, message: Quiz) => {
      alert('問題が出題されました！')
      this.init()
      this.quiz = message
    }
    this.realtimeAPI.answerHandler = (from: string, message: Answer) => { console.log(message) }
    this.realtimeAPI.correctAnswerHandler = (from: string, message: CorrectAnswer) => { console.log(message) }
    this.realtimeAPI.connectionOpenedHandler = (from: string, message: ConnectionOpened) => { alert(`${message.name}が参加したよ！`) }
    this.realtimeAPI.connectionClosedHandler = (from: string, message: ConnectionClosed) => { alert(`${message.name}が退室したよ！`) }

    const roomId = this.$route.params.roomId
    this.realtimeAPI.connect(roomId)
  }

  onClickQuiz () {
    this.realtimeAPI.quiz(this.quiz)
  }

  onClickAnswer () {
    this.realtimeAPI.answer(this.myAnswer)
  }

  onClickCorrectAnswer () {
    this.realtimeAPI.correctAnswer(this.correctAnswer)
  }

  private uuidv4 () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}
type AnswerWithSender = Answer & {
  from: string;
}
</script>
