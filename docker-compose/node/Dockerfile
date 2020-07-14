FROM node:12

WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install

RUN npm-run-all -s clean:next build:production

EXPOSE 3100

CMD ["npm", "run", "start:server"]