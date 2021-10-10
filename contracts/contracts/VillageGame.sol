// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import "hardhat/console.sol";
import './VillageGold.sol';

contract VillageGame is Ownable {

    event NewVillage(uint villageId, string name, int8 _x, int8 _y);
    event NewBuilding(uint villageId, BuildingTypes buildingType, uint8 _x, uint8 _y);

    enum BuildingTypes { TownHall, GoldMine, Wall, AdventurerHall, House, Armoury, Blacksmith, Warehouse }

    // Mapping from each building to how large they are on the map
    mapping(BuildingTypes => uint8) public buildingSizes;

    address villageGoldAddress;

    VillageGold villageGoldContract;

    // Building attributes: size, initialGoldCost, levelUpCostMultiplier 
    uint statsDigits = 16;

    uint statsModulus = 10 ** statsDigits;

    // Mapping of all villages
    mapping (uint => Village) villages;

    // Village IDs by their coordinates
    mapping(int8 => mapping(int8 => uint256)) public villageMap;

    struct BuildingPlacement {
        uint8 x;
        uint8 y;
        uint8 size;
        uint8 level;
        uint32 upgradeCompleteTime;
        BuildingTypes buildingType;
        bool exists;
    }

    struct Village {
        int8 x;
        int8 y;
        uint8 size;
        uint8 baseGoldRate;
        uint256 lastMined;
        uint256 id;
        uint256 stats;
        string name;
        BuildingPlacement[] buildings;
        bool exists;
        // mapping (BuildingTypes => uint8) buildingLevels;
    }

    struct VillageBuildingId {
        uint id;
        bool exists;
    }

    uint mapSize = 100;

    uint villageCounter = 1;

    // Building level for each building for each village... should it be an index for the array of the building in the village instead of a level?
    mapping (uint => mapping (BuildingTypes => VillageBuildingId)) internal buildingIds;

    constructor() {
        buildingSizes[BuildingTypes.TownHall] = 3;
        buildingSizes[BuildingTypes.GoldMine] = 1;
        buildingSizes[BuildingTypes.Wall] = 0;
        buildingSizes[BuildingTypes.AdventurerHall] = 1;
        buildingSizes[BuildingTypes.House] = 1;
        buildingSizes[BuildingTypes.Armoury] = 1;
        buildingSizes[BuildingTypes.Blacksmith] = 1;
        buildingSizes[BuildingTypes.Warehouse] = 2;
    }

    function _generateStats(int8 _x, int8 _y) private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, _x, _y)));
        return rand % statsModulus;
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
        village.lastMined = block.number;
        village.name = _name;
        village.stats = _generateStats(_x, _y);
        village.exists = true;

        villageMap[_x][_y] = villageId;
        emit NewVillage(villageId, _name, _x, _y);
    }

    function _villageHasBuilding(uint _villageId, BuildingTypes _buildingType) internal view returns (bool) {
        VillageBuildingId storage buildingId = buildingIds[_villageId][_buildingType];
        return buildingId.exists;
    }

    function _getVillageBuilding(uint _villageId, BuildingTypes _buildingType) internal view returns (BuildingPlacement storage) {
        VillageBuildingId storage buildingId = buildingIds[_villageId][_buildingType];
        require(buildingId.exists, 'Building not yet built!');
        return villages[_villageId].buildings[buildingId.id];
    }

    function _getNextVillageCost() internal view returns (uint) {
        return _getVillageCost(villageCounter + 1);
    }

    function _getVillageCost(uint villageId) internal pure returns (uint) {
        return 1 ether * 0.0001 * (villageId / 100 + 1) ** 2;
    }

    function setMapSize(uint _mapSize) external onlyOwner {
        require(_mapSize > mapSize, 'New map size must be bigger than old map size');
        // TODO: Check 'payment'
        mapSize = _mapSize;
    }

    function _requireHasNoBuilding(uint8 _x, uint8 _y, BuildingPlacement[] storage _buildings) private view {
        // For each of the tiles, check another building doesn't already cover it
        for (uint8 k = 0; k < _buildings.length; k++) {
            BuildingPlacement storage building = _buildings[k];
            uint8 buildingUpperX = building.x + building.size - 1;
            uint8 buildingUpperY = building.y + building.size - 1;
            require(_x < building.x || _x > buildingUpperX || _y < building.y || _y > buildingUpperY, 'Clashes with existing building');
        }
    }

    function _placeBuilding(uint _villageId, BuildingTypes _buildingType, uint8 _x, uint8 _y) internal {
        Village storage village = villages[_villageId];
        // Make sure the building doesn't already exist
        require(!_villageHasBuilding(_villageId, _buildingType), 'This type of building has already been built');
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
            buildingType: _buildingType,
            exists: true
        }));
        uint buildingId = village.buildings.length - 1;
        buildingIds[_villageId][_buildingType] = VillageBuildingId(buildingId, true);
        emit NewBuilding(_villageId, _buildingType, _x, _y);
    }

    function _upgradeBuilding(uint _villageId) internal returns (uint) {
        
    }

    function _getGoldMinedPerBlock(uint _villageId) internal view returns (uint) {
        uint goldmineLevel = _getVillageBuilding(_villageId, BuildingTypes.GoldMine).level;
        return 1 ether * 0.03 * goldmineLevel;
    }

    function _getGoldMaxStorageAmount(uint _villageId) internal view returns (uint) {
        VillageBuildingId storage buildingId = buildingIds[_villageId][BuildingTypes.Warehouse];
        uint warehouseLevel = buildingId.exists ? villages[_villageId].buildings[buildingId.id].level : 0;
        return 1 ether * (100 + 30 * warehouseLevel ** 2);
    }

    function _getGoldMineableAmount(uint _villageId) internal view returns (uint) {
        Village memory village = villages[_villageId];
        require(village.exists == true, 'village ID does not exist');
        if (!_villageHasBuilding(_villageId, BuildingTypes.GoldMine)) {
            return 0;
        }
        uint goldPerBlock = _getGoldMinedPerBlock(_villageId);
        uint blocksSinceLastMined = block.number - villages[_villageId].lastMined;
        uint goldToMine = goldPerBlock * blocksSinceLastMined;
        uint maxGold = _getGoldMaxStorageAmount(_villageId);
        if (goldToMine > maxGold) {
            return maxGold;
        }
        return goldToMine;
    }

    function _mineGold(uint _villageId) internal {
        require(_villageHasBuilding(_villageId, BuildingTypes.GoldMine), 'Mine not yet built');
        uint mineableAmount = _getGoldMineableAmount(_villageId);

        Village storage village = villages[_villageId];
        villageGoldContract.sendMiningReward(msg.sender, mineableAmount);
        village.lastMined = block.number;
    }

    function getVillage(uint _villageId) public view returns (Village memory village) {
        village = villages[_villageId];
        require(village.exists == true, 'village ID does not exist');
        return village;
    }

    function setVillageGoldContract(address _contractAddress) public onlyOwner {
        villageGoldAddress = _contractAddress;
        villageGoldContract = VillageGold(_contractAddress);
    }
}
