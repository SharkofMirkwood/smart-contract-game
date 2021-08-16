import { expect, should } from 'chai';
import { ethers } from 'hardhat';
import { Contract, ContractFactory, Signer } from 'ethers';

describe('VillageNft', () => {
  let VillageGold: ContractFactory;
  let villageGold: Contract;

  let owner: Signer;
  let alice: Signer;
  let bob: Signer;

  beforeEach(async () => {
    VillageGold = await ethers.getContractFactory('VillageGold');
    villageGold = await VillageGold.deploy();
    await villageGold.deployed();
    [owner, alice, bob] = await ethers.getSigners();
  });


});
