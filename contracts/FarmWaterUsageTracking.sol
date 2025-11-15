// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWaterUsageTracking
 * @dev Onchain system for tracking water consumption and usage patterns
 */
contract FarmWaterUsageTracking is Ownable {
    struct WaterUsageRecord {
        uint256 recordId;
        uint256 fieldId;
        uint256 waterVolume;
        string usageType;
        uint256 usageDate;
        address recorder;
    }

    mapping(uint256 => WaterUsageRecord) public waterUsageRecords;
    mapping(address => uint256[]) public recordsByRecorder;
    uint256 private _recordIdCounter;

    event WaterUsageRecorded(
        uint256 indexed recordId,
        address indexed recorder,
        uint256 waterVolume
    );

    constructor() Ownable(msg.sender) {}

    function recordWaterUsage(
        uint256 fieldId,
        uint256 waterVolume,
        string memory usageType,
        uint256 usageDate
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        waterUsageRecords[recordId] = WaterUsageRecord({
            recordId: recordId,
            fieldId: fieldId,
            waterVolume: waterVolume,
            usageType: usageType,
            usageDate: usageDate,
            recorder: msg.sender
        });

        recordsByRecorder[msg.sender].push(recordId);

        emit WaterUsageRecorded(recordId, msg.sender, waterVolume);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (WaterUsageRecord memory) {
        return waterUsageRecords[recordId];
    }
}
