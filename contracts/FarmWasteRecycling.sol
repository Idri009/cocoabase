// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWasteRecycling
 * @dev Waste recycling and composting tracking
 */
contract FarmWasteRecycling is Ownable {
    struct RecyclingRecord {
        uint256 recordId;
        address farmer;
        string wasteType;
        uint256 quantity;
        string recyclingMethod;
        uint256 recordDate;
        bool processed;
    }

    mapping(uint256 => RecyclingRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event RecordCreated(
        uint256 indexed recordId,
        address indexed farmer,
        string wasteType
    );

    event WasteProcessed(
        uint256 indexed recordId,
        uint256 quantity
    );

    constructor() Ownable(msg.sender) {}

    function createRecord(
        string memory wasteType,
        uint256 quantity,
        string memory recyclingMethod
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = RecyclingRecord({
            recordId: recordId,
            farmer: msg.sender,
            wasteType: wasteType,
            quantity: quantity,
            recyclingMethod: recyclingMethod,
            recordDate: block.timestamp,
            processed: false
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit RecordCreated(recordId, msg.sender, wasteType);
        return recordId;
    }

    function markProcessed(uint256 recordId) public {
        require(records[recordId].farmer == msg.sender, "Not authorized");
        records[recordId].processed = true;
        emit WasteProcessed(recordId, records[recordId].quantity);
    }

    function getRecord(uint256 recordId) public view returns (RecyclingRecord memory) {
        return records[recordId];
    }
}
