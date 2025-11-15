// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWaterUsageOptimization
 * @dev Water usage analytics and optimization recommendations
 */
contract FarmWaterUsageOptimization is Ownable {
    struct WaterUsageRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        uint256 waterUsed;
        uint256 optimalUsage;
        uint256 efficiencyPercentage;
        uint256 recordDate;
    }

    mapping(uint256 => WaterUsageRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event UsageRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        uint256 efficiencyPercentage
    );

    constructor() Ownable(msg.sender) {}

    function recordUsage(
        string memory fieldId,
        uint256 waterUsed,
        uint256 optimalUsage
    ) public returns (uint256) {
        uint256 efficiencyPercentage = (optimalUsage * 10000) / waterUsed;
        if (efficiencyPercentage > 10000) efficiencyPercentage = 10000;

        uint256 recordId = _recordIdCounter++;
        records[recordId] = WaterUsageRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            waterUsed: waterUsed,
            optimalUsage: optimalUsage,
            efficiencyPercentage: efficiencyPercentage,
            recordDate: block.timestamp
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit UsageRecorded(recordId, msg.sender, efficiencyPercentage);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (WaterUsageRecord memory) {
        return records[recordId];
    }
}
