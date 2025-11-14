// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmGrainStorage
 * @dev Onchain grain storage management and tracking
 */
contract FarmGrainStorage is Ownable {
    struct StorageRecord {
        uint256 storageId;
        string grainType;
        uint256 quantity;
        uint256 storageDate;
        uint256 expiryDate;
        string storageLocation;
        uint256 temperature;
        uint256 humidity;
        address owner;
        bool isActive;
        uint256 lastInspection;
    }

    mapping(uint256 => StorageRecord) public storageRecords;
    mapping(address => uint256[]) public storageByOwner;
    uint256 private _storageIdCounter;

    event GrainStored(
        uint256 indexed storageId,
        address indexed owner,
        string grainType,
        uint256 quantity,
        uint256 storageDate
    );

    event GrainRetrieved(
        uint256 indexed storageId,
        address indexed owner,
        uint256 quantity,
        uint256 retrievalDate
    );

    event StorageInspected(
        uint256 indexed storageId,
        uint256 inspectionDate,
        uint256 temperature,
        uint256 humidity
    );

    constructor() Ownable(msg.sender) {}

    function storeGrain(
        string memory grainType,
        uint256 quantity,
        uint256 expiryDate,
        string memory storageLocation,
        uint256 temperature,
        uint256 humidity
    ) public returns (uint256) {
        uint256 storageId = _storageIdCounter++;
        storageRecords[storageId] = StorageRecord({
            storageId: storageId,
            grainType: grainType,
            quantity: quantity,
            storageDate: block.timestamp,
            expiryDate: expiryDate,
            storageLocation: storageLocation,
            temperature: temperature,
            humidity: humidity,
            owner: msg.sender,
            isActive: true,
            lastInspection: block.timestamp
        });

        storageByOwner[msg.sender].push(storageId);

        emit GrainStored(storageId, msg.sender, grainType, quantity, block.timestamp);
        return storageId;
    }

    function retrieveGrain(uint256 storageId, uint256 quantity) public {
        require(storageRecords[storageId].owner == msg.sender, "Not the owner");
        require(storageRecords[storageId].isActive, "Storage not active");
        require(storageRecords[storageId].quantity >= quantity, "Insufficient quantity");

        storageRecords[storageId].quantity -= quantity;
        if (storageRecords[storageId].quantity == 0) {
            storageRecords[storageId].isActive = false;
        }

        emit GrainRetrieved(storageId, msg.sender, quantity, block.timestamp);
    }

    function inspectStorage(
        uint256 storageId,
        uint256 temperature,
        uint256 humidity
    ) public {
        require(storageRecords[storageId].owner == msg.sender, "Not the owner");
        storageRecords[storageId].temperature = temperature;
        storageRecords[storageId].humidity = humidity;
        storageRecords[storageId].lastInspection = block.timestamp;

        emit StorageInspected(storageId, block.timestamp, temperature, humidity);
    }

    function getStorageRecord(uint256 storageId) public view returns (StorageRecord memory) {
        return storageRecords[storageId];
    }

    function getStorageByOwner(address owner) public view returns (uint256[] memory) {
        return storageByOwner[owner];
    }
}

