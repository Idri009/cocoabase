// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockHeatStressMonitoring
 * @dev Onchain heat stress monitoring and mitigation tracking
 */
contract FarmLivestockHeatStressMonitoring is Ownable {
    struct HeatStressRecord {
        uint256 recordId;
        address farmer;
        string livestockId;
        uint256 temperature;
        uint256 humidity;
        uint256 stressLevel;
        uint256 recordDate;
        string mitigationMeasures;
    }

    mapping(uint256 => HeatStressRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event StressRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string livestockId,
        uint256 stressLevel
    );

    constructor() Ownable(msg.sender) {}

    function recordHeatStress(
        string memory livestockId,
        uint256 temperature,
        uint256 humidity,
        uint256 stressLevel,
        string memory mitigationMeasures
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = HeatStressRecord({
            recordId: recordId,
            farmer: msg.sender,
            livestockId: livestockId,
            temperature: temperature,
            humidity: humidity,
            stressLevel: stressLevel,
            recordDate: block.timestamp,
            mitigationMeasures: mitigationMeasures
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit StressRecorded(recordId, msg.sender, livestockId, stressLevel);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (HeatStressRecord memory) {
        return records[recordId];
    }
}

