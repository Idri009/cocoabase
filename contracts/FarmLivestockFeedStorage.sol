// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockFeedStorage
 * @dev Onchain feed storage management and inventory tracking
 */
contract FarmLivestockFeedStorage is Ownable {
    struct StorageRecord {
        uint256 recordId;
        address farmer;
        string feedType;
        uint256 quantity;
        string storageLocation;
        uint256 storageDate;
        uint256 expiryDate;
        string storageConditions;
    }

    mapping(uint256 => StorageRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event StorageRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string feedType,
        uint256 quantity
    );

    constructor() Ownable(msg.sender) {}

    function recordStorage(
        string memory feedType,
        uint256 quantity,
        string memory storageLocation,
        uint256 expiryDate,
        string memory storageConditions
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = StorageRecord({
            recordId: recordId,
            farmer: msg.sender,
            feedType: feedType,
            quantity: quantity,
            storageLocation: storageLocation,
            storageDate: block.timestamp,
            expiryDate: expiryDate,
            storageConditions: storageConditions
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit StorageRecorded(recordId, msg.sender, feedType, quantity);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (StorageRecord memory) {
        return records[recordId];
    }
}

