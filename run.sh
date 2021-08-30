#!/bin/bash

docker-compose stop
docker-compose build
docker-compose up -d

# TODO replace the sleep with something else
sleep 5

mkdir -p frontend/src/contracts
cp -r contracts/artifacts/contracts/VillageNft.sol frontend/src/contracts/
cp -r contracts/artifacts/contracts/VillageGold.sol frontend/src/contracts/

docker-compose exec hardhat bash -c "./node_modules/.bin/hardhat run --network localhost scripts/deploy.js" | grep VUE_APP_ >> frontend/.env.local

docker-compose restart frontend

docker-compose logs -f
