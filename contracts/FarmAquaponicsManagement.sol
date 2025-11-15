// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmAquaponicsManagement
 * @dev Aquaponics system management with fish and plant integration tracking
 */
contract FarmAquaponicsManagement is Ownable {
    struct AquaponicsSystem {
        uint256 systemId;
        address owner;
        string location;
        uint256 fishPopulation;
        string fishSpecies;
        uint256 plantBedCount;
        uint256 waterPh;
        uint256 waterTemperature;
        uint256 lastMaintenance;
    }

    mapping(uint256 => AquaponicsSystem) public systems;
    mapping(address => uint256[]) public systemsByOwner;
    uint256 private _systemIdCounter;

    event SystemRegistered(
        uint256 indexed systemId,
        address indexed owner,
        string location
    );

    event MaintenanceRecorded(
        uint256 indexed systemId,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    function registerSystem(
        string memory location,
        uint256 fishPopulation,
        string memory fishSpecies,
        uint256 plantBedCount,
        uint256 waterPh,
        uint256 waterTemperature
    ) public returns (uint256) {
        uint256 systemId = _systemIdCounter++;
        systems[systemId] = AquaponicsSystem({
            systemId: systemId,
            owner: msg.sender,
            location: location,
            fishPopulation: fishPopulation,
            fishSpecies: fishSpecies,
            plantBedCount: plantBedCount,
            waterPh: waterPh,
            waterTemperature: waterTemperature,
            lastMaintenance: block.timestamp
        });

        systemsByOwner[msg.sender].push(systemId);
        emit SystemRegistered(systemId, msg.sender, location);
        return systemId;
    }

    function recordMaintenance(uint256 systemId) public {
        require(systems[systemId].owner == msg.sender, "Not authorized");
        systems[systemId].lastMaintenance = block.timestamp;
        emit MaintenanceRecorded(systemId, block.timestamp);
    }

    function getSystem(uint256 systemId) public view returns (AquaponicsSystem memory) {
        return systems[systemId];
    }
}
