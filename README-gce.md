## CI/CD 関連

### ssh 鍵作成

`$ ssh-keygen -t rsa -f my-ssh-key -C [任意のsshユーザーネーム]`

### 設定すべき環境変数

- GOOGLE_PROJECT_ID
- GOOGLE_COMPUTE_REGION

  例: asia-northeast1

- GOOGLE_COMPUTE_ZONE

  例: asia-northeast1-a

- GOOGLE_SERVICE_KEY

  サービスアカンウトを base64 エンコードした文字列
  `base64 -i [.json file path]`

- SSH_USERNAME

  ssh ユーザーネーム

- SSH_KEY

  ssh 秘密鍵を base64 エンコードした文字列
  `base64 -i my-ssh-key`

- SSH_KEY_PUB

  ssh 公開鍵を base64 エンコードした文字列
  `base64 -i my-ssh-key.pub`

- SSH_PORT

  ssh 接続のポート
  空いていればなんでもよい。基本は 22 だがセキュリティー上変更した方がいい
