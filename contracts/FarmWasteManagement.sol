// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWasteManagement
 * @dev Onchain waste management system
 */
contract FarmWasteManagement is Ownable {
    struct WasteRecord {
        uint256 recordId;
        address farmOwner;
        string wasteType;
        uint256 amount;
        string disposalMethod;
        uint256 date;
        bool recycled;
        uint256 recyclingValue;
    }

    mapping(uint256 => WasteRecord) public records;
    mapping(address => uint256[]) public recordsByOwner;
    uint256 private _recordIdCounter;

    event RecordCreated(
        uint256 indexed recordId,
        address indexed farmOwner,
        string wasteType,
        uint256 amount
    );

    event WasteRecycled(
        uint256 indexed recordId,
        uint256 recyclingValue
    );

    constructor() Ownable(msg.sender) {}

    function createWasteRecord(
        string memory wasteType,
        uint256 amount,
        string memory disposalMethod
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = WasteRecord({
            recordId: recordId,
            farmOwner: msg.sender,
            wasteType: wasteType,
            amount: amount,
            disposalMethod: disposalMethod,
            date: block.timestamp,
            recycled: false,
            recyclingValue: 0
        });

        recordsByOwner[msg.sender].push(recordId);

        emit RecordCreated(recordId, msg.sender, wasteType, amount);
        return recordId;
    }

    function markAsRecycled(uint256 recordId, uint256 recyclingValue) public {
        WasteRecord storage record = records[recordId];
        require(record.farmOwner == msg.sender, "Not the owner");
        require(!record.recycled, "Already recycled");

        record.recycled = true;
        record.recyclingValue = recyclingValue;

        emit WasteRecycled(recordId, recyclingValue);
    }

    function getRecord(uint256 recordId) public view returns (WasteRecord memory) {
        return records[recordId];
    }

    function getRecordsByOwner(address owner) public view returns (uint256[] memory) {
        return recordsByOwner[owner];
    }
}

