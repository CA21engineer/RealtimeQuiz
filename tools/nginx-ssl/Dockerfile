FROM nginx:latest

ENV PROXY_SERVER_HOST "localhost:18080"

# 【ドメイン名 スペース区切りで複数指定可】
ENV LETSENCRYPT_HOSTS "localhost"

# 【窓口メールアドレス】
ENV LETSENCRYPT_MAIL "example@localhost"

# 【←仮証明書用の記載内容】
ENV LETSENCRYPT_SUBJECT "/C=JP/ST=Tokyo/L=Shinagawa/CN=default"

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update \
    && apt-get install --yes --no-install-recommends \
      openssl \
      certbot \
    && rm -rf /var/lib/apt/lists/*

COPY generate.sh /generate.sh
COPY start.sh /start.sh

CMD bash generate.sh > /etc/nginx/nginx.conf && sh /start.sh
