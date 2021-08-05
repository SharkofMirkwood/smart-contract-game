#!/bin/bash

docker-compose stop
docker-compose build
docker-compose up -d

# TODO replace the sleep with something else
sleep 5

mkdir -p frontend/contracts
cp -r contracts/artifacts/contracts/VillageNft.sol frontend/contracts/VillageNft.sol

docker-compose exec hardhat bash -c "./node_modules/.bin/hardhat run --network localhost scripts/deploy.js" | grep VUE_APP_CONTRACT_ADDRESS >> frontend/.env.local

docker-compose restart frontend

docker-compose logs -f
