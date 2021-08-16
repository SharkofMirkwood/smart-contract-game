async function main() {
  // We get the contract to deploy
  VillageNft = await ethers.getContractFactory('VillageNft');
  villageNft = await VillageNft.deploy();

  VillageGold = await ethers.getContractFactory('VillageGold');
  villageGold = await VillageGold.deploy();

  await villageGold.setVillageNftContract(villageNft.address);

  console.log(`VUE_APP_NFT_CONTRACT_ADDRESS=${villageNft.address}`);
  console.log(`VUE_APP_GOLD_CONTRACT_ADDRESS=${villageGold.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
