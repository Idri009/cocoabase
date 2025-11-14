// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockHealth
 * @dev Onchain system for tracking livestock health records
 */
contract FarmLivestockHealth is Ownable {
    struct HealthRecord {
        uint256 recordId;
        uint256 livestockId;
        string healthStatus;
        uint256 checkDate;
        string veterinarian;
        address recorder;
        bool vaccinated;
    }

    mapping(uint256 => HealthRecord) public healthRecords;
    mapping(address => uint256[]) public recordsByRecorder;
    uint256 private _recordIdCounter;

    event HealthRecordCreated(
        uint256 indexed recordId,
        address indexed recorder,
        uint256 livestockId
    );

    event VaccinationRecorded(uint256 indexed recordId);

    constructor() Ownable(msg.sender) {}

    function createHealthRecord(
        uint256 livestockId,
        string memory healthStatus,
        string memory veterinarian
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        healthRecords[recordId] = HealthRecord({
            recordId: recordId,
            livestockId: livestockId,
            healthStatus: healthStatus,
            checkDate: block.timestamp,
            veterinarian: veterinarian,
            recorder: msg.sender,
            vaccinated: false
        });

        recordsByRecorder[msg.sender].push(recordId);

        emit HealthRecordCreated(recordId, msg.sender, livestockId);
        return recordId;
    }

    function recordVaccination(uint256 recordId) public {
        require(healthRecords[recordId].recorder == msg.sender, "Not the recorder");
        healthRecords[recordId].vaccinated = true;
        emit VaccinationRecorded(recordId);
    }

    function getRecord(uint256 recordId) public view returns (HealthRecord memory) {
        return healthRecords[recordId];
    }
}


