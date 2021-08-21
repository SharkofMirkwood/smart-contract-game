import { expect, should } from 'chai';
import { ethers } from 'hardhat';
import { Contract, ContractFactory, Signer } from 'ethers';
const { formatUnits } = ethers.utils;

describe('VillageNft', () => {
  let VillageNft: ContractFactory;
  let villageNft: Contract;

  let VillageGold: ContractFactory;
  let villageGold: Contract;

  let owner: Signer;
  let alice: Signer;
  let bob: Signer;

  const villageName = 'My village';

  beforeEach(async () => {
    VillageNft = await ethers.getContractFactory('VillageNft');
    villageNft = await VillageNft.deploy();
    await villageNft.deployed();

    VillageGold = await ethers.getContractFactory('VillageGold');
    villageGold = await VillageGold.deploy(10000);
    await villageGold.deployed();
    await villageNft.setVillageGoldContract(villageGold.address);
    await villageGold.setVillageNftAddress(villageNft.address);

    [owner, alice, bob] = await ethers.getSigners();
  });

  describe('token creation', () => {

    it('should be able to create a new village token', async () => {
      const result = await villageNft.connect(alice).createVillage(villageName, 0, 0);
      const receipt = await result.wait();
      expect(receipt.status).to.eql(1);
      expect(receipt.events[0].args.name).to.eql(villageName);
    });

    it('should allow further villages to be created at different coordinates', async () => {
      const result1 = await villageNft.connect(alice).createVillage(villageName, 0, 0);
      const receipt1 = await result1.wait();
      expect(receipt1.status).to.eql(1);
      expect(receipt1.events[0].args.name).to.eql(villageName);

      const result2 = await villageNft.connect(alice).createVillage(villageName, 50, 100);
      const receipt2 = await result2.wait();
      expect(receipt2.status).to.eql(1);
      expect(receipt2.events[0].args.name).to.eql(villageName);

      const result3 = await villageNft.connect(bob).createVillage('Another village', 100, 100);
      const receipt3 = await result3.wait();
      expect(receipt3.status).to.eql(1);
      expect(receipt3.events[0].args.name).to.eql('Another village');
    });

    it('should fail to create a second token with the same coordinates', async () => {
      await villageNft.connect(alice).createVillage(villageName, 0, 0);

      const txn = villageNft.connect(alice).createVillage(villageName, 0, 0);
      await expect(txn).to.be.revertedWith('village already exists at these coordinates');

      const txnBob = villageNft.connect(bob).createVillage(villageName, 0, 0);
      await expect(txnBob).to.be.revertedWith('village already exists at these coordinates');
    });

    it('should fail to create a village at coordinates beyond the size of the map', async () => {
      await villageNft.connect(alice).createVillage(villageName, 0, 0);

      const txn = villageNft.connect(alice).createVillage(villageName, 0, 101);
      await expect(txn).to.be.revertedWith('y coordinate out of bounds');

      const txnBob = villageNft.connect(alice).createVillage(villageName, 101, 0);
      await expect(txnBob).to.be.revertedWith('x coordinate out of bounds');
    });

  });

  describe('transferring tokens', async () => {
    it('should transfer a village NFT', async () => {
      const result = await villageNft.connect(alice).createVillage(villageName, 0, 0);
      const receipt = await result.wait();
      const villageId = receipt.events.filter((x: any) => x.event === 'NewVillage')[0].args.villageId.toNumber();

      const aliceAddress = await alice.getAddress();
      const bobAddress = await bob.getAddress();

      await villageNft.connect(alice).transferFrom(aliceAddress, bobAddress, villageId);
      const newOwner = await villageNft.connect(alice).ownerOf(villageId);
      expect(newOwner).to.eql(bobAddress);

      const aliceBalance = await villageNft.balanceOf(aliceAddress);
      const bobBalance = await villageNft.balanceOf(bobAddress);
      expect(aliceBalance.toNumber()).to.eql(0);
      expect(bobBalance.toNumber()).to.eql(1);
    });


    describe('two-step transfer scenario', async () => {
      it('should approve and then transfer a village when the approved address calls transferFrom', async () => {
        const result = await villageNft.connect(alice).createVillage(villageName, 0, 0);
        const receipt = await result.wait();
        const villageId = receipt.events.filter((x: any) => x.event === 'NewVillage')[0].args.villageId.toNumber();
  
        const aliceAddress = await alice.getAddress();
        const bobAddress = await bob.getAddress();
  
        await villageNft.connect(alice).approve(bobAddress, villageId);

        await villageNft.connect(bob).transferFrom(aliceAddress, bobAddress, villageId);
        const newOwner = await villageNft.connect(alice).ownerOf(villageId);
        expect(newOwner).to.eql(bobAddress);
      });

      it('should approve and then transfer a village when the owner calls transferFrom', async () => {
        const result = await villageNft.connect(alice).createVillage(villageName, 0, 0);
        const receipt = await result.wait();
        const villageId = receipt.events.filter((x: any) => x.event === 'NewVillage')[0].args.villageId.toNumber();
  
        const aliceAddress = await alice.getAddress();
        const bobAddress = await bob.getAddress();
  
        await villageNft.connect(alice).approve(bobAddress, villageId);

        await villageNft.connect(alice).transferFrom(aliceAddress, bobAddress, villageId);
        const newOwner = await villageNft.connect(alice).ownerOf(villageId);
        expect(newOwner).to.eql(bobAddress);
      });
    });
  });

  // describe('Get building sizes', () => {
  //   it.only('should get the mapping of building sizes', async () => {
  //     const result = await villageNft.buildingSizes(0);
  //     console.log(result);
  //   });
  // });

  describe('Building placement', () => {
    let villageId: number;

    beforeEach(async () => {
      const result = await villageNft.connect(alice).createVillage(villageName, 0, 0);
      const receipt = await result.wait();
      villageId = receipt.events.filter((x: any) => x.event === 'NewVillage')[0].args.villageId.toNumber();
    });

    it('should place a building at 0, 0', async () => {
      const result = await villageNft.connect(alice).placeBuilding(villageId, 0, 0, 0);
      const receipt = await result.wait();
      expect(receipt.status).to.eql(1);
      expect(receipt.events[0].event).to.eql('NewBuilding');
    });

    it('should place a building at different coordinates', async () => {
      const result = await villageNft.connect(alice).placeBuilding(villageId, 0, 1, 1);
      const receipt = await result.wait();
      expect(receipt.status).to.eql(1);
      expect(receipt.events[0].event).to.eql('NewBuilding');
    });

    it('should place a building at the edge of a larger village', async () => {
      // TODO: Set building size to >5 and put building at the edge
      const result = await villageNft.connect(alice).placeBuilding(villageId, 0, 2, 2);
      const receipt = await result.wait();
      expect(receipt.status).to.eql(1);
      expect(receipt.events[0].event).to.eql('NewBuilding');
    });

    it('should allow placement next to an existing building', async () => {
      const result = await villageNft.connect(alice).placeBuilding(villageId, 0, 0, 0);
      const receipt = await result.wait();
      expect(receipt.status).to.eql(1);

      const result2 = await villageNft.connect(alice).placeBuilding(villageId, 1, 0, 3);
      const receipt2 = await result2.wait();
      expect(receipt2.status).to.eql(1);
      expect(receipt2.events[0].event).to.eql('NewBuilding');
    });

    it('should not allow placement of a building on a village belonging to someone else', async () => {
      const txn = villageNft.connect(bob).placeBuilding(villageId, 0, 2, 2);
      await expect(txn).to.be.revertedWith('Not the owner of the village');
    });

    it('should not allow placement of a building on coordinates larger than the village size', async () => {
      const txn = villageNft.connect(alice).placeBuilding(villageId, 0, 6, 6);
      await expect(txn).to.be.revertedWith('New placement out of bounds for village size');
    });

    it('should not allow placement of a building that would partly sit outside the village', async () => {
      const txn = villageNft.connect(alice).placeBuilding(villageId, 0, 3, 2);
      await expect(txn).to.be.revertedWith('New placement out of bounds for village size');
    });

    it('should not allow placement of two overlapping buildings', async () => {
      const result = await villageNft.connect(alice).placeBuilding(villageId, 0, 0, 0);
      const receipt = await result.wait();
      expect(receipt.status).to.eql(1);
      expect(receipt.events[0].event).to.eql('NewBuilding');

      const txn = villageNft.connect(alice).placeBuilding(villageId, 1, 1, 2);
      await expect(txn).to.be.revertedWith('Clashes with existing building');
    });

  });

  describe('get village', () => {
    let villageId: number;

    beforeEach(async () => {
      const result = await villageNft.connect(alice).createVillage(villageName, 0, 0);
      const receipt = await result.wait();
      villageId = receipt.events[0].args.villageId.toNumber();
      await villageNft.connect(alice).placeBuilding(villageId, 0, 0, 0);
    });

    it('should be able to retrieve a village token that was created', async () => {
      const result = await villageNft.getVillage(villageId);

      expect(result.x).to.eql(0);
      expect(result.y).to.eql(0);
      expect(result.size).to.eql(5);
      expect(result.baseGoldRate).to.eql(100);
      expect(result.name).to.eql(villageName);
      expect(`${result.stats}`).to.have.length.greaterThan(0);
      expect(`${result.stats}`).to.have.length.lessThanOrEqual(16);

      expect(result.buildings).to.have.length(1);
      expect(result.buildings[0].x).to.eql(0);
      expect(result.buildings[0].y).to.eql(0);
      expect(result.buildings[0].size).to.eql(3);
      expect(result.buildings[0].level).to.eql(1);
      expect(result.buildings[0].buildingType).to.eql(0);
    });

    it('should error for a village that does not exist', async () => {
      const txnBob = villageNft.getVillage(1000);
      await expect(txnBob).to.be.revertedWith('village ID does not exist');
    });

  });

  describe('balances & enumerability', () => {
    beforeEach(async () => {
      await villageNft.connect(alice).createVillage(`${villageName}1`, 0, 0);
      await villageNft.connect(alice).createVillage(`${villageName}2`, 1, 1);
    });

    it('should return 0 tokens for a user who has not created any', async () => {
      const result = await villageNft.balanceOf(bob.getAddress());
      expect(result.toNumber()).to.eql(0);
    });

    it('should return the amount of tokens when a user owns some', async () => {
      const result = await villageNft.balanceOf(alice.getAddress());
      expect(result.toNumber()).to.eql(2);
    });

    it('should return the correct data for a token owner by a user', async () => {
      const villageIds = await Promise.all([
        villageNft.tokenOfOwnerByIndex(alice.getAddress(), 0),
        villageNft.tokenOfOwnerByIndex(alice.getAddress(), 1),
      ]);
      const villages = await Promise.all([
        villageNft.getVillage(villageIds[0]),
        villageNft.getVillage(villageIds[1]),
      ]);
      expect(villages[0].x).to.eql(0);
      expect(villages[0].y).to.eql(0);
      expect(villages[0].name).to.eql(`${villageName}1`);
      expect(villages[1].x).to.eql(1);
      expect(villages[1].y).to.eql(1);
      expect(villages[1].name).to.eql(`${villageName}2`);
    });

    it('should throw an error trying to access an index out of bounds', async () => {
      const txn = villageNft.tokenOfOwnerByIndex(alice.getAddress(), 2);
      await expect(txn).to.be.revertedWith('ERC721Enumerable: owner index out of bounds');
    });

    it('should return the correct amount for each user after a transfer', async () => {
      const villageId = await villageNft.tokenOfOwnerByIndex(alice.getAddress(), 1)
      await villageNft.connect(alice).transferFrom(alice.getAddress(), bob.getAddress(), villageId);
      const [aliceBalance, bobBalance] = await Promise.all([
        villageNft.balanceOf(alice.getAddress()),
        villageNft.balanceOf(bob.getAddress()),
      ]);
      expect(aliceBalance.toNumber()).to.eql(1);
      expect(bobBalance.toNumber()).to.eql(1);
    });

  });

  describe('mining', () => {
    let villageIdWithoutMine: number;
    let villageIdWithMine: number;
    
    beforeEach(async () => {
      const result = await villageNft.connect(alice).createVillage(villageName, 0, 0);
      const receipt = await result.wait();
      villageIdWithoutMine = receipt.events.filter((x: any) => x.event === 'NewVillage')[0].args.villageId.toNumber();

      const result2 = await villageNft.connect(alice).createVillage(`${villageName}2`, 0, 1);
      const receipt2 = await result2.wait();
      villageIdWithMine = receipt2.events.filter((x: any) => x.event === 'NewVillage')[0].args.villageId.toNumber();
      await villageNft.connect(alice).placeBuilding(villageIdWithMine, 0, 0, 0);
      await villageNft.connect(alice).placeBuilding(villageIdWithMine, 1, 3, 3);
      for (let i = 0; i < 5; i += 1) {
        await ethers.provider.send('evm_mine', []);
      }
    });
  
    it('should not allow mining of a village belonging to a different address', async () => {
      const txn = villageNft.connect(bob).mineGold(villageIdWithMine);
      await expect(txn).to.be.revertedWith('Not the owner of the village');
    });
  
    it('should not allow mining if the mine has not been built', async () => {
      const txn = villageNft.connect(alice).mineGold(villageIdWithoutMine);
      await expect(txn).to.be.revertedWith('Mine not yet built');
    });
  
    it('should get the balance available to mine', async () => {
      const availableGold = await villageNft.getGoldMineableAmount(villageIdWithMine);
      expect(formatUnits(availableGold, 'ether')).to.eql('0.21'); 

      const availableGoldNoMine = await villageNft.getGoldMineableAmount(villageIdWithoutMine);
      expect(formatUnits(availableGoldNoMine, 'ether')).to.eql('0.0'); 
    });
  
    it('should mine gold if the mine has Gold to mine, and send the gold to the address of the owner of the village', async () => {
      const goldBalance = await villageGold.balanceOf(alice.getAddress());
      expect(formatUnits(goldBalance, 'ether')).to.eql('0.0'); 

      const availableGold = await villageNft.getGoldMineableAmount(villageIdWithMine);
      expect(formatUnits(availableGold, 'ether')).to.eql('0.21'); 

      // FOr some reason a new block is always mined when this is executed; balance below will be higher than when checked above
      await villageNft.connect(alice).mineGold(villageIdWithMine);

      const newAvailableGold = await villageNft.getGoldMineableAmount(villageIdWithMine);
      expect(formatUnits(newAvailableGold, 'ether')).to.eql('0.0'); 
      
      const newGoldBalance = await villageGold.balanceOf(alice.getAddress());
      expect(formatUnits(newGoldBalance, 'ether')).to.eql('0.24'); 
    });
  
    it('should only mine the maximum storage amount if the capacity of the village has been reached', async () => {
      const maxGold = '100.0';

      for (let i = 0; i < 5000; i += 1) {
        await ethers.provider.send('evm_mine', []);
      }

      const availableGold = await villageNft.getGoldMineableAmount(villageIdWithMine);
      expect(formatUnits(availableGold, 'ether')).to.eql(maxGold);

      await villageNft.connect(alice).mineGold(villageIdWithMine);

      const newAvailableGold = await villageNft.getGoldMineableAmount(villageIdWithMine);
      expect(formatUnits(newAvailableGold, 'ether')).to.eql('0.0');
      
      const newGoldBalance = await villageGold.balanceOf(alice.getAddress());
      expect(formatUnits(newGoldBalance, 'ether')).to.eql(maxGold);
    });
  });
  
});
