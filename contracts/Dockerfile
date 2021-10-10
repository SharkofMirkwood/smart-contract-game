FROM node:14

WORKDIR /srv
COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY scripts scripts
COPY hardhat.config.ts ./

COPY contracts contracts

EXPOSE 8545

ENTRYPOINT [ "./node_modules/.bin/hardhat", "node" ]
