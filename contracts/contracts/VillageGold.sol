// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@openzeppelin/contracts/access/Ownable.sol';

contract VillageGold is ERC20, Ownable {

  address villageNftContract;

  constructor(uint256 initialSupply) ERC20('VillageGold', 'VGLD') {
    _mint(msg.sender, initialSupply);
  }

  function setVillageNftContract(address _contractAddress) public onlyOwner {
    villageNftContract = _contractAddress;
  }

  function sendMiningReward(uint amount, address receiver) public {
    require(msg.sender == villageNftContract, 'Only village NFT contract allowed');
    _mint(receiver, amount);
  }
}
