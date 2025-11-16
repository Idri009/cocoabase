// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmEnergyStorage
 * @dev Energy storage system management and capacity tracking
 */
contract FarmEnergyStorage is Ownable {
    struct StorageSystem {
        uint256 systemId;
        address farmer;
        string storageType;
        uint256 capacity;
        uint256 currentCharge;
        uint256 installationDate;
    }

    mapping(uint256 => StorageSystem) public systems;
    mapping(address => uint256[]) public systemsByFarmer;
    uint256 private _systemIdCounter;

    event SystemInstalled(
        uint256 indexed systemId,
        address indexed farmer,
        uint256 capacity
    );

    event ChargeUpdated(
        uint256 indexed systemId,
        uint256 currentCharge
    );

    constructor() Ownable(msg.sender) {}

    function installSystem(
        string memory storageType,
        uint256 capacity
    ) public returns (uint256) {
        uint256 systemId = _systemIdCounter++;
        systems[systemId] = StorageSystem({
            systemId: systemId,
            farmer: msg.sender,
            storageType: storageType,
            capacity: capacity,
            currentCharge: 0,
            installationDate: block.timestamp
        });

        systemsByFarmer[msg.sender].push(systemId);
        emit SystemInstalled(systemId, msg.sender, capacity);
        return systemId;
    }

    function updateCharge(uint256 systemId, uint256 charge) public {
        require(systems[systemId].farmer == msg.sender, "Not authorized");
        require(charge <= systems[systemId].capacity, "Exceeds capacity");
        systems[systemId].currentCharge = charge;
        emit ChargeUpdated(systemId, charge);
    }

    function getSystem(uint256 systemId) public view returns (StorageSystem memory) {
        return systems[systemId];
    }
}
