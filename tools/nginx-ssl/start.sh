#!/bin/bash

for HOST in ${LETSENCRYPT_HOSTS}
do
  if [ ! -d "/etc/letsencrypt/live/${HOST}" ]; then
    mkdir -p /etc/letsencrypt/live/${HOST}
    mkdir -p /var/lib/letsencrypt

    crt_file="/etc/letsencrypt/live/${HOST}/fullchain.pem" &&
    key_file="/etc/letsencrypt/live/${HOST}/privkey.pem" &&
    subject="${LETSENCRYPT_SUBJECT}" &&
    openssl req -new -newkey rsa:2048 -sha256 -x509 -nodes \
      -set_serial 1 \
      -days 3650 \
      -subj "$subject" \
      -out "$crt_file" \
      -keyout "$key_file" &&
    chmod 400 "$key_file"
  fi
done

nginx

for HOST in ${LETSENCRYPT_HOSTS}
do
  if [ ! -e "/etc/letsencrypt/initialize" ]; then
    rm -rf /etc/letsencrypt/live/${HOST}
    certbot certonly -n --keep-until-expiring --agree-tos \
      --webroot --webroot-path /var/lib/letsencrypt \
      -m ${LETSENCRYPT_MAIL} -d ${HOST}
  fi
done

touch /etc/letsencrypt/initialize
certbot renew

nginx -s reload

while true
do
    sleep 7
done
