// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@openzeppelin/contracts/access/Ownable.sol';

contract VillageGold is ERC20, Ownable {

  address villageNftAddress;

  constructor(uint256 initialSupply) ERC20('MyNiftyTownGold', 'MNTG') {
    _mint(msg.sender, initialSupply);
  }

  function setVillageNftAddress(address _contractAddress) public onlyOwner {
    villageNftAddress = _contractAddress;
  }

  function sendMiningReward(address receiver, uint amount) public {
    require(msg.sender == villageNftAddress, 'Only village NFT contract allowed');
    _mint(receiver, amount);
  }
}
