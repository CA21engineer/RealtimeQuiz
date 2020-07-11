## 送受信データ

### 随時

#### ステータス情報
ゲームのステータスと参加者情報を受け取る

この情報がそのまま画面の内容となる。全員の画面に変更が必要な場合、この情報を送信する。

* 誰かが入室した時
* 誰かが退出した時
* 問題出題時
* 誰かが解答した時
* 全員が解答し終わった時

#### ブラウザからサーバへ
(none)

#### サーバからブラウザへ
```
{
    'type': 'status',

    'data': {
        // 今の状態を示す
        'currentStatus': 'WAITING_QUESTION' | 'CLOSE_ANSWER' | 'OPEN_ANSWER' | 'OPEN_AGGRIGATE',
    
        'currentQuestion': string | null    // 今出ている問題 CLOSE_ANSWER, OPEN_ANSWER, OPEN_AGGRIGATEの時必須
    
        'players': [
            // プレイヤーの数だけ下のオブジェクトが増える
            {
                'id': string                // 一意なID
                'name': string              // ニックネーム
                'isAdmin': boolean          // 管理側かどうか
                'isSpectator': boolean      // 観戦者かどうか   
                'stars': number             // 星の数
                'answer': string | null,    // プレイヤーが解答した内容
                'isAnswered': boolean,      // このプレイヤーが解答したか
                'alterStars': number | null // 変更されたスターの数 'OPEN_AGGRIGATE' の時必須
            }
        ]
    }
}
```


### ルーム入室時

#### プレイヤー名前変更
ブラウザがURLを開き、プレイヤー名を入力・決定したとき。

##### ブラウザからサーバへ 
```
{
    'type': 'changeName',

    'data': {
        'accountName': string,
        'isSpectator': boolean,
    }
}
```

##### サーバからブラウザへ
(none)

### 出題待ち状態

#### 出題する問題
* 管理者側 `isAdmin` に限って叩ける

##### ブラウザからサーバへ
```
{
    'type': 'setQuestion',

    'data': {
        'question': string,
    }
}
```

##### サーバからブラウザへ
(none)

*ステータス情報* の `currentStatus` で代用する。

ステータス情報の `currentStatus` を `CLOSE_ANSWER` に変更し、問題情報を追加して再送する。

### 問題解答待ち状態

#### 解答送信
プレイヤーの解答を送信する。

##### サーバからブラウザへ
* 時間切れ時

```
{
    'type': 'forceSendAnswer'
}
```

##### ブラウザからサーバへ
* 時間切れ時にサーバから強制解答送信指示をもらった時
* プレイヤーが `解答する` ボタンを押した時

```
{
    'type': 'setAnswer',
    'data': {
        'answer': string,
    }
}
```

同時に全プレイヤーにステータス情報を再送

### 解答オープン待ち状態

#### 一斉に解答オープン

##### ブラウザからサーバへ
* 管理者側 `isAdmin` に限って叩ける

```
{
    'type': 'openAnswers'
}
```

##### サーバからブラウザへ
(none)

*ステータス情報* の `currentStatus` で代用する。

サーバが `openAnswers` を受信後ステータス情報の `currentStatus` を `OPEN_ANSWER` に変更し再送する。

##### ブラウザからサーバへ
(none)

### 結果発表終了待ち状態

#### 集計結果送信

##### ブラウザからサーバへ
* 管理者側 `isAdmin` に限って叩ける

```
{
    'type': 'setAlterStars',

    'data': {
        'alterStars': [
            {
                'accountId': string,
                'alterStars': number,
            }
        ],    
    },
}
```

##### サーバからブラウザへ
(none)

*ステータス情報* の `currentStatus` で代用する。

サーバが `setAlterStars` を受信後ステータス情報の `currentStatus` を `OPEN_AGGRIGATE` に変更し再送する。

#### 結果発表終了 & 次の問題へ

##### ブラウザからサーバへ
* 管理者側 `isAdmin` に限って叩ける

```
{
    'type': 'goToNextQuestion',
}
```

##### サーバからブラウザへ
(none)

*ステータス情報* の `currentStatus` で代用する。
サーバが `goToNextQuestion` を受信後ステータス情報の `currentStatus` を `WAITING_QUESTION` に変更し再送する。