FROM node:12

WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run start:ci

ARG API_BASE_URL
ARG WS_BASE_URL

RUN echo $API_BASE_URL >> .env
RUN echo $WS_BASE_URL >> .env

EXPOSE 3100

CMD ["npm", "run", "start:server"]
