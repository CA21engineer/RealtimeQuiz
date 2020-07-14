FROM node:12

WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install

EXPOSE 3100

CMD ["npm", "run", "start:ci"]