// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockWeightGainTracking
 * @dev Weight gain tracking and growth performance analysis
 */
contract FarmLivestockWeightGainTracking is Ownable {
    struct WeightGainRecord {
        uint256 recordId;
        address farmer;
        string livestockId;
        uint256 previousWeight;
        uint256 currentWeight;
        uint256 gainRate;
        uint256 recordDate;
    }

    mapping(uint256 => WeightGainRecord) public records;
    uint256 private _recordIdCounter;

    event RecordCreated(
        uint256 indexed recordId,
        address indexed farmer,
        uint256 gainRate
    );

    constructor() Ownable(msg.sender) {}

    function recordWeightGain(
        string memory livestockId,
        uint256 previousWeight,
        uint256 currentWeight
    ) public returns (uint256) {
        require(currentWeight > previousWeight, "Invalid weights");
        uint256 gainRate = ((currentWeight - previousWeight) * 10000) / previousWeight;
        uint256 recordId = _recordIdCounter++;
        records[recordId] = WeightGainRecord({
            recordId: recordId,
            farmer: msg.sender,
            livestockId: livestockId,
            previousWeight: previousWeight,
            currentWeight: currentWeight,
            gainRate: gainRate,
            recordDate: block.timestamp
        });

        emit RecordCreated(recordId, msg.sender, gainRate);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (WeightGainRecord memory) {
        return records[recordId];
    }
}
