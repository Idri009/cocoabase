// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropMonitoring
 * @dev Onchain system for monitoring crop growth and health
 */
contract FarmCropMonitoring is Ownable {
    struct MonitoringRecord {
        uint256 recordId;
        uint256 plantationId;
        string growthStage;
        uint256 healthScore;
        uint256 monitoringDate;
        string observations;
        address monitor;
    }

    mapping(uint256 => MonitoringRecord) public monitoringRecords;
    mapping(address => uint256[]) public recordsByMonitor;
    uint256 private _recordIdCounter;

    event CropMonitored(
        uint256 indexed recordId,
        address indexed monitor,
        string growthStage
    );

    constructor() Ownable(msg.sender) {}

    function recordMonitoring(
        uint256 plantationId,
        string memory growthStage,
        uint256 healthScore,
        string memory observations
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        monitoringRecords[recordId] = MonitoringRecord({
            recordId: recordId,
            plantationId: plantationId,
            growthStage: growthStage,
            healthScore: healthScore,
            monitoringDate: block.timestamp,
            observations: observations,
            monitor: msg.sender
        });

        recordsByMonitor[msg.sender].push(recordId);

        emit CropMonitored(recordId, msg.sender, growthStage);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (MonitoringRecord memory) {
        return monitoringRecords[recordId];
    }
}

