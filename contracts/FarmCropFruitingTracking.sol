// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropFruitingTracking
 * @dev Onchain fruit development and yield potential tracking
 */
contract FarmCropFruitingTracking is Ownable {
    struct FruitingRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        string cropType;
        uint256 fruitCount;
        uint256 averageSize;
        uint256 developmentStage;
        uint256 recordDate;
        uint256 estimatedYield;
    }

    mapping(uint256 => FruitingRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event FruitingRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        uint256 fruitCount,
        uint256 estimatedYield
    );

    constructor() Ownable(msg.sender) {}

    function recordFruiting(
        string memory fieldId,
        string memory cropType,
        uint256 fruitCount,
        uint256 averageSize,
        uint256 developmentStage,
        uint256 estimatedYield
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = FruitingRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            cropType: cropType,
            fruitCount: fruitCount,
            averageSize: averageSize,
            developmentStage: developmentStage,
            recordDate: block.timestamp,
            estimatedYield: estimatedYield
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit FruitingRecorded(recordId, msg.sender, fieldId, fruitCount, estimatedYield);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (FruitingRecord memory) {
        return records[recordId];
    }
}
