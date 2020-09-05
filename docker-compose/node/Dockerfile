FROM node:12

WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run start:ci

EXPOSE 3100

CMD ["npm", "run", "start:server"]
