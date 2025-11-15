// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropDiseaseTracking
 * @dev Onchain system for tracking crop diseases
 */
contract FarmCropDiseaseTracking is Ownable {
    struct DiseaseRecord {
        uint256 recordId;
        uint256 plantationId;
        string diseaseType;
        uint256 severity;
        uint256 detectionDate;
        string treatment;
        address tracker;
        bool resolved;
    }

    mapping(uint256 => DiseaseRecord) public diseaseRecords;
    mapping(address => uint256[]) public recordsByTracker;
    uint256 private _recordIdCounter;

    event DiseaseDetected(
        uint256 indexed recordId,
        address indexed tracker,
        string diseaseType
    );

    event DiseaseResolved(uint256 indexed recordId);

    constructor() Ownable(msg.sender) {}

    function recordDisease(
        uint256 plantationId,
        string memory diseaseType,
        uint256 severity,
        string memory treatment
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        diseaseRecords[recordId] = DiseaseRecord({
            recordId: recordId,
            plantationId: plantationId,
            diseaseType: diseaseType,
            severity: severity,
            detectionDate: block.timestamp,
            treatment: treatment,
            tracker: msg.sender,
            resolved: false
        });

        recordsByTracker[msg.sender].push(recordId);

        emit DiseaseDetected(recordId, msg.sender, diseaseType);
        return recordId;
    }

    function markAsResolved(uint256 recordId) public {
        require(diseaseRecords[recordId].tracker == msg.sender, "Not the tracker");
        diseaseRecords[recordId].resolved = true;
        emit DiseaseResolved(recordId);
    }

    function getRecord(uint256 recordId) public view returns (DiseaseRecord memory) {
        return diseaseRecords[recordId];
    }
}



