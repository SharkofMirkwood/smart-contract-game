async function main() {
  // We get the contract to deploy
  VillageNft = await ethers.getContractFactory('VillageNft');
  villageNft = await VillageNft.deploy();

  console.log(`VUE_APP_CONTRACT_ADDRESS=${villageNft.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });