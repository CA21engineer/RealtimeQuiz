FROM node:12

WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run start:ci

# TODO Nextで直接参照できるようにしたい
RUN echo $API_BASE_URL >> .env
RUN echo $WS_BASE_URL >> .env

EXPOSE 3100

CMD ["npm", "run", "start:server"]
