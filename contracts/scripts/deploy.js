async function main() {
  // We get the contract to deploy
  VillageNft = await ethers.getContractFactory('VillageNft');
  villageNft = await VillageNft.deploy();

  VillageGold = await ethers.getContractFactory('VillageGold');
  villageGold = await VillageGold.deploy(ethers.utils.parseEther('10000'));

  await Promise.all([
    villageNft.deployed(),
    villageGold.deployed(),
  ]);

  await villageNft.setVillageGoldContract(villageGold.address);
  await villageGold.setVillageNftAddress(villageNft.address);

  console.log(`VUE_APP_NFT_CONTRACT_ADDRESS=${villageNft.address}`);
  console.log(`VUE_APP_GOLD_CONTRACT_ADDRESS=${villageGold.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
