import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract, ContractFactory, Signer } from 'ethers';

describe('VillageNft', () => {
  let VillageNft: ContractFactory;
  let villageNft: Contract;

  let owner: Signer;
  let alice: Signer;
  let bob: Signer;

  const villageName = 'My village';

  beforeEach(async () => {
    VillageNft = await ethers.getContractFactory('VillageNft');
    villageNft = await VillageNft.deploy();
    await villageNft.deployed();
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

  describe('Building placement', () => {
    let villageId: number;

    beforeEach(async () => {
      const result = await villageNft.connect(alice).createVillage(villageName, 0, 0);
      const receipt = await result.wait();
      villageId = receipt.events.filter((x: any) => x.event === 'NewVillage')[0].args.villageId.toNumber();
    })

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

      const txn = villageNft.connect(alice).placeBuilding(villageId, 0, 1, 2);
      await expect(txn).to.be.revertedWith('Clashes with existing building');
    });

  });
  
});
