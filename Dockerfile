FROM node:14-alpine

RUN apk add --no-cache bash

EXPOSE 3000

COPY . /app
WORKDIR /app

RUN npm i
RUN npm build

CMD npm start