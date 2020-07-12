# app


## Install Websocket Curl
`$ npm install -g wscat`

## 動作確認
```bash
$ curl -X POST localhost:18080/api/room/accountId/parent -d '{}'
{"roomId":"cc9d2afa23b64bfa9275cc496f835dde"}

$ curl -X GET localhost:18080/api/room
{"rooms":["cc9d2afa23b64bfa9275cc496f835dde"]}

$ wscat --wait 600 -c localhost:18080/ws/room/DebugRoom/accountId/admin
$ wscat --wait 600 -c localhost:18080/ws/room/DebugRoom/accountId/child1
$ wscat --wait 600 -c localhost:18080/ws/room/DebugRoom/accountId/child2
$ wscat --wait 600 -c localhost:18080/ws/room/DebugRoom/accountId/child3




> {"type":"JoiningRoom", "data":{"accountName":"CHILD1"}}
> {"type":"SetQuestion", "data":{"question":"問題です！"}}
> {"type":"SetAnswer", "data":{"answer":"答えはこれ？"}}
> {"type":"SetAlterStars", "data":{"alterStars":[{"accountId":"child1", "alterStars":10}]}}
> {"type":"GoToNextQuestion", "data":{}}
```
