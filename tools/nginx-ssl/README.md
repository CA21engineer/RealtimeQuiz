# nginx-ssl

`nginx-ssl`を挟むことで気軽にSSL化することができます。
[ Client ] - example.com -> [ DNS ]
[ DNS ] - localhost:443 -> [ nginx-ssl-server ] - localhost:18080 -> [ Other Server ]

※取得したドメインとサーバーの外部IPの紐付け作業などは省略します
`DNS Aレコード`などと検索すれば色々出てくると思います

※SSL証明書を短期間で新規で何度も発行すると制限されます
`docker-compose restart`での証明書更新は問題ないのでご注意ください

## docker-compose sample
```yaml
version: "3.4"
services:
  ssl-proxy-server:
    restart: always
    build: nginx-ssl
    environment:
      TZ: Asia/Tokyo
      PROXY_SERVER_HOSTS: "https://google.com https://yahoo.co.jp" # SSL化したいサーバーの[ホスト:ポート]
      LETSENCRYPT_HOSTS: "localhost api.localhost" # 取得したドメイン
      LETSENCRYPT_MAIL: example@localhost # あなたの連絡先メール
      LETSENCRYPT_SUBJECT: "/C=JP/ST=Tokyo/L=Shinagawa/CN=default"
    ports:
      - 80:80
      - 443:443
```

## 参考
https://tech.actindi.net/2018/09/20/093414
