#!/bin/bash

# LETSENCRYPT_HOSTS="localhost api.localhost" PROXY_SERVER_HOSTS="host.docker.internal:18080 host.docker.internal:18080" sh generate.sh > nginx.conf

domains=(`echo ${LETSENCRYPT_HOSTS}`)
hosts=(`echo ${PROXY_SERVER_HOSTS}`)

if [ ${#domains[@]} != ${#hosts[@]} ]; then
  echo "環境変数を正しく設定してください"
  exit 1
fi

cat << 'EOS'
user  nginx;
worker_processes  1;

error_log /var/log/nginx/error.log ;
pid /var/run/nginx.pid;

events {
  worker_connections  1024;
}


http {
  client_max_body_size 50m;

  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  log_format main '$remote_addr - $remote_user [$time_local] "$request" '
            '$status $body_bytes_sent "$http_referer" '
            '"$http_user_agent" "$http_x_forwarded_for"';

  sendfile on;
  keepalive_timeout 15;

  gzip on;
  gzip_disable "msie6";
  gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;

  server {
      listen 80 default_server;
      return 301 https://$host$request_uri;
  }
EOS

i=0
for HOST in ${domains[@]}
do

cat << EOS
server {
    listen 443 ssl;
    server_name ${HOST};

    ssl_certificate /etc/letsencrypt/live/${HOST}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${HOST}/privkey.pem;
EOS
cat << 'EOS'
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv3:+EXP;
    ssl_prefer_server_ciphers on;

    # Let's Encrypt証明書の更新に必要なので残しておくこと
    location ^~ /.well-known/acme-challenge {
      alias /var/lib/letsencrypt/.well-known/acme-challenge;
      default_type "text/plain";
      try_files $uri =404;
    }

    location / {
EOS

cat << EOS
        proxy_pass ${hosts[$i]};
EOS
cat << 'EOS'
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
  }
EOS

let i++
done

cat <<EOS
}
EOS
