FROM node:12

WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN ln -s envs/production.env .env
RUN npm run start:ci

EXPOSE 3100

CMD ["npm", "run", "start:server"]
