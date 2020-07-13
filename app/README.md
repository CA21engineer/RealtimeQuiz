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
1 > {"type":"ChangeName", "data":{"accountName":"Parent_name"}}
3 > {"type":"SetQuestion", "data":{"question":"問題です！"}}
5 > {"type":"CloseApplications"}
6 > {"type":"OpenAnswers"}
7 > {"type":"SetAlterStars", "data":{"alterStars":[{"accountId":"child1", "alterStars":10}]}}
8 > {"type":"GoToNextQuestion"}

$ wscat --wait 600 -c localhost:18080/ws/room/DebugRoom/accountId/child1
2 > {"type":"ChangeName", "data":{"accountName":"Child1_name"}}
4 > {"type":"SetAnswer", "data":{"answer":"答えはこれ？"}}
```
