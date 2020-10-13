FROM node:12

WORKDIR /usr/src/app
COPY package*.json ./
ARG API_BASE_URL
ARG WS_BASE_URL
RUN echo API_BASE_URL=$API_BASE_URL >> .env
RUN echo WS_BASE_URL=$WS_BASE_URL >> .env
RUN npm install

COPY . .
EXPOSE 3100

CMD ["node", "./node_modules/next/dist/bin/next", "dev", "-p", "3100"]
