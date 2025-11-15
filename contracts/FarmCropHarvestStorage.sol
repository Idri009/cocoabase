// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropHarvestStorage
 * @dev Onchain harvest storage management and inventory tracking
 */
contract FarmCropHarvestStorage is Ownable {
    struct StorageRecord {
        uint256 recordId;
        address farmer;
        string harvestBatchId;
        string storageLocation;
        uint256 quantity;
        uint256 storageDate;
        uint256 expectedExpiry;
        string storageConditions;
    }

    mapping(uint256 => StorageRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event StorageRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string harvestBatchId,
        string storageLocation
    );

    constructor() Ownable(msg.sender) {}

    function recordStorage(
        string memory harvestBatchId,
        string memory storageLocation,
        uint256 quantity,
        uint256 expectedExpiry,
        string memory storageConditions
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = StorageRecord({
            recordId: recordId,
            farmer: msg.sender,
            harvestBatchId: harvestBatchId,
            storageLocation: storageLocation,
            quantity: quantity,
            storageDate: block.timestamp,
            expectedExpiry: expectedExpiry,
            storageConditions: storageConditions
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit StorageRecorded(recordId, msg.sender, harvestBatchId, storageLocation);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (StorageRecord memory) {
        return records[recordId];
    }
}

