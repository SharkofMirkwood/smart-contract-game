// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import './VillageGame.sol';
import 'hardhat/console.sol';

contract VillageNft is VillageGame, ERC721Enumerable {

    modifier onlyOwnerOf(uint _villageId) {
        // require(msg.sender == _owners[_villageId], 'Not the owner of the village!');
        require(ERC721.ownerOf(_villageId) == msg.sender, "Not the owner of the village");
        _;
    }

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    constructor() ERC721('GameLand', 'LND') {
    }

    function createVillage(string memory _name, int8 _x, int8 _y) public returns (uint villageId) {
        villageId = _createVillage(_name, _x, _y);
        _mint(msg.sender, villageId);
    }

    function placeBuilding(uint _villageId, BuildingTypes _buildingType, uint8 _x, uint8 _y) external onlyOwnerOf(_villageId) {
        _placeBuilding(_villageId, _buildingType, _x, _y);
    }

}
