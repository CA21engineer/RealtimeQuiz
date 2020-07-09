<template>
  <div class="home">
    <h2>部屋一覧</h2>
    <div v-for="item in rooms" :key="item.roomId">
      {{ item.roomId }} ({{ item.participants}} 人参加中) | <button @click="onJoin(item.roomId)">参加する</button>
    </div>
    <h2>ルーム作成</h2>
    <button @click="createRoom">作成する</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import RestAPI, { Room } from '@/lib/restapi'

@Component({
  components: {}
})

export default class Home extends Vue {
  restAPI!: RestAPI
  rooms: Array<Room> = []

  async created () {
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
    this.rooms = (await this.restAPI.getRooms())
  }

  onJoin (roomId: string) {
    this.$router.push({ name: 'RoomView', params: { roomId: roomId } })
  }

  async createRoom () {
    this.rooms = (await this.restAPI.createRoom()
      .then(_ => this.restAPI.getRooms()))
  }

  private uuidv4 () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}
</script>
