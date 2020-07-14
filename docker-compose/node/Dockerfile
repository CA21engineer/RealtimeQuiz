FROM node:12

WORKDIR /usr/src/app
COPY ./package*.json ./

EXPOSE 3100

CMD ["npm", "ci", "&&", "npm", "run", "start:ci"]