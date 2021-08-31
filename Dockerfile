FROM node:15-alpine

EXPOSE 3000
ENV VERSION=20210831210232

RUN apk add git
RUN npm install -g npm@7.21.0
RUN npm install -g browserify
RUN npm install -g uglify-js

WORKDIR /usr/src/app/frontend
COPY frontend/package.json .
RUN npm install
COPY frontend/ .
RUN npm run bundle

WORKDIR /usr/src/app/backend
COPY backend/package.json .
RUN npm install
COPY backend/ .

CMD [ "node", "app.js" ]
