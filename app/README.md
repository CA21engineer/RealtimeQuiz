# app


## Install Websocket Curl
`$ npm install -g wscat`

## 動作確認
```bash
$ curl -X POST localhost:18080/api/room/accountId/parent/name/bambootuna
{"roomId":"cc9d2afa23b64bfa9275cc496f835dde"}

$ curl -X GET localhost:18080/api/room
{"rooms":["cc9d2afa23b64bfa9275cc496f835dde"]}

$ wscat --wait 600 -c localhost:18080/ws/room/debugRoomId/accountId/admin/name/admin_name
$ wscat --wait 600 -c localhost:18080/ws/room/debugRoomId/accountId/child1/name/child1_name
$ wscat --wait 600 -c localhost:18080/ws/room/debugRoomId/accountId/child2/name/child2_name
$ wscat --wait 600 -c localhost:18080/ws/room/debugRoomId/accountId/child3/name/child3_name


{"no":1, "content":"Quiz", "points":10}
{"content":"Answer"}
{"content":"", "points": 11}
```