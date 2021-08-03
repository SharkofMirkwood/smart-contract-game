FROM node:14

WORKDIR /srv

COPY scripts scripts
COPY package*.json ./
COPY hardhat.config.ts ./
COPY tsconfig.json ./

RUN npm ci

COPY contracts contracts

EXPOSE 8080

ENTRYPOINT [ "./node_modules/.bin/hardhat", "node" ]
