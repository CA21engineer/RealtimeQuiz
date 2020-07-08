<template>
  <div class="room-view">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import RestAPI, { Room } from '@/lib/restapi'
import RealtimeAPI from '@/lib/realtimeapi'

@Component({
  components: {}
})

export default class RoomView extends Vue {
  restAPI!: RestAPI
  realtimeAPI!: RealtimeAPI

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
    this.realtimeAPI = new RealtimeAPI(accountId, accountName)

    const roomId = this.$route.params.roomId
    this.realtimeAPI.connect(roomId)
  }

  private uuidv4 () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}
</script>
