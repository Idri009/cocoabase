// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmBeekeepingManagement
 * @dev Beekeeping operations tracking including hive health and honey production
 */
contract FarmBeekeepingManagement is Ownable {
    struct Hive {
        uint256 hiveId;
        address beekeeper;
        string location;
        uint256 colonyStrength;
        uint256 honeyProduction;
        uint256 lastInspection;
        bool healthy;
        uint256 queenAge;
    }

    mapping(uint256 => Hive) public hives;
    mapping(address => uint256[]) public hivesByBeekeeper;
    uint256 private _hiveIdCounter;

    event HiveRegistered(
        uint256 indexed hiveId,
        address indexed beekeeper,
        string location
    );

    event HoneyHarvested(
        uint256 indexed hiveId,
        uint256 amount
    );

    constructor() Ownable(msg.sender) {}

    function registerHive(
        string memory location,
        uint256 colonyStrength,
        uint256 queenAge
    ) public returns (uint256) {
        uint256 hiveId = _hiveIdCounter++;
        hives[hiveId] = Hive({
            hiveId: hiveId,
            beekeeper: msg.sender,
            location: location,
            colonyStrength: colonyStrength,
            honeyProduction: 0,
            lastInspection: block.timestamp,
            healthy: true,
            queenAge: queenAge
        });

        hivesByBeekeeper[msg.sender].push(hiveId);
        emit HiveRegistered(hiveId, msg.sender, location);
        return hiveId;
    }

    function recordHarvest(uint256 hiveId, uint256 amount) public {
        require(hives[hiveId].beekeeper == msg.sender, "Not authorized");
        hives[hiveId].honeyProduction += amount;
        emit HoneyHarvested(hiveId, amount);
    }

    function updateHealthStatus(uint256 hiveId, bool healthy) public {
        require(hives[hiveId].beekeeper == msg.sender, "Not authorized");
        hives[hiveId].healthy = healthy;
        hives[hiveId].lastInspection = block.timestamp;
    }

    function getHive(uint256 hiveId) public view returns (Hive memory) {
        return hives[hiveId];
    }
}
