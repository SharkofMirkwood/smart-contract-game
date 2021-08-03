FROM node:14

WORKDIR /srv

COPY public public
COPY package*.json ./
COPY babel.config.js ./
COPY tsconfig.json ./

RUN npm ci

COPY .env* ./
COPY src src

EXPOSE 8080

ENTRYPOINT [ "npm", "run", "serve" ]
