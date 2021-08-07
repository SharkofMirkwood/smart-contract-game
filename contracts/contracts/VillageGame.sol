// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import "hardhat/console.sol";

contract VillageGame is Ownable {

    event NewVillage(uint villageId, string name, int8 _x, int8 _y);
    event NewBuilding(uint villageId, BuildingTypes buildingType, uint8 _x, uint8 _y);

    enum BuildingTypes { TownHall, GoldMine, Wall, AdventurerHall, House, Armoury, Blacksmith }

    // Mapping from each building to how large they are on the map
    mapping(BuildingTypes => uint8) public buildingSizes;

    // Mapping of all villages
    mapping (uint => Village) villages;

    // Village IDs by their coordinates
    mapping(int8 => mapping(int8 => uint256)) private villageMap;

    struct BuildingPlacement {
        uint8 x;
        uint8 y;
        uint8 size;
        uint8 level;
        uint32 upgradeCompleteTime;
        BuildingTypes buildingType;
    }

    struct Village {
        int8 x;
        int8 y;
        uint8 size;
        uint8 baseGoldRate;
        uint32 readyToMineTime;
        uint256 id;
        string name;
        BuildingPlacement[] buildings;
        bool exists;
        // mapping (BuildingTypes => uint8) buildingLevels;
    }

    uint mapSize = 100;

    uint villageCounter = 1;

    mapping (uint => mapping (BuildingTypes => uint8)) buildingLevels;

    constructor() {
        buildingSizes[BuildingTypes.TownHall] = 3;
        buildingSizes[BuildingTypes.GoldMine] = 1;
        buildingSizes[BuildingTypes.Wall] = 0;
        buildingSizes[BuildingTypes.AdventurerHall] = 1;
        buildingSizes[BuildingTypes.House] = 1;
        buildingSizes[BuildingTypes.Armoury] = 1;
        buildingSizes[BuildingTypes.Blacksmith] = 1;
    }

    function _createVillage(string memory _name, int8 _x, int8 _y) internal returns (uint villageId) {
        // Check x and y params are both within the max size of the map
        require(_x <= int(mapSize) && _x >= 0 - int(mapSize), 'x coordinate out of bounds');
        require(_y <= int(mapSize) && _y >= 0 - int(mapSize), 'y coordinate out of bounds');

        // Make sure another village doesn't already exist here
        require(villageMap[_x][_y] == 0, 'village already exists at these coordinates');

        // We cannot use `villages.push(Village(...))` because the RHS creates a memory-struct "Village" that contains a mapping.
        villageId = villageCounter++;
        Village storage village = villages[villageId];
        village.id = villageId;
        village.x = _x;
        village.y = _y;
        village.size = 5;
        village.baseGoldRate = 100;
        village.readyToMineTime = uint32(block.timestamp);
        village.name = _name;
        village.exists = true;

        villageMap[_x][_y] = villageId;
        emit NewVillage(villageId, _name, _x, _y);
    }


    function _getBuildingLevel(uint _villageId, BuildingTypes _buildingType) internal view returns (uint8) {
        // return villages[_villageId].buildingLevels[_buildingType];
        return buildingLevels[_villageId][_buildingType];
    }

    function setMapSize(uint _mapSize) external onlyOwner {
        require(_mapSize > mapSize, 'New map size must be bigger than old map size');
        // TODO: Check 'payment'
        mapSize = _mapSize;
    }

    function _requireHasNoBuilding(uint8 x, uint8 y, BuildingPlacement[] storage buildings) private view {
        // For each of the tiles, check another building doesn't already cover it
        for (uint8 k = 0; k < buildings.length; k++) {
            BuildingPlacement storage building = buildings[k];
            uint8 buildingUpperX = building.x + building.size - 1;
            uint8 buildingUpperY = building.y + building.size - 1;
            require(x < building.x || x > buildingUpperX || y < building.y || y > buildingUpperY, 'Clashes with existing building');
        }
    }

    function _placeBuilding(uint _villageId, BuildingTypes _buildingType, uint8 _x, uint8 _y) internal {
        Village storage village = villages[_villageId];
        // Make sure the building doesn't already exist
        require(_getBuildingLevel(_villageId, _buildingType) == 0, 'This type of building has already been built');
        uint8 size = buildingSizes[_buildingType];
        // Make sure the building size was correctly retrieved
        require(size > 0, 'Error, invalid building size. Check building type parameter.');
        // Make sure we are not out of bounds
        require(_x + size <= village.size, 'New placement out of bounds for village size');
        require(_y + size <= village.size, 'New placement out of bounds for village size');
        // Make sure we don't clash with any other buildings. `size` should be low enough (~1 to 3) that the iteration here hopefully won't be a problem
        for (uint8 i = _x; i < _x + size; i++) {
            for (uint8 j = _y; j < _y + size; j++) {
                _requireHasNoBuilding(_x, _y, village.buildings);
            }
        }
        village.buildings.push(BuildingPlacement({
            x: _x,
            y: _y,
            size: size,
            level: 1,
            upgradeCompleteTime: uint32(block.timestamp),
            buildingType: _buildingType
        }));
        emit NewBuilding(_villageId, _buildingType, _x, _y);
    }

    function _upgradeBuilding(uint _villageId) internal {

    }

    function getVillage(uint _villageId) public view returns (Village memory village) {
        village = villages[_villageId];
        require(village.exists == true, 'village ID does not exist');
    }

    // function mineGold(uint _villageId) external onlyOwnerOf(_villageId) {
    //     Village storage village = villages[_villageId];
    //     require(_getBuildingLevel(_villageId, BuildingTypes.GoldMine) > 0, 'Gold mine not yet built');

    // }

}
