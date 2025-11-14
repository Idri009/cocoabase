// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmPestDiseaseTracking
 * @dev Onchain system for tracking pests and diseases
 */
contract FarmPestDiseaseTracking is Ownable {
    struct PestDiseaseRecord {
        uint256 recordId;
        uint256 plantationId;
        string pestDiseaseType;
        string severity;
        uint256 detectionDate;
        address reporter;
        bool treated;
        string treatmentMethod;
    }

    mapping(uint256 => PestDiseaseRecord) public records;
    mapping(address => uint256[]) public recordsByReporter;
    uint256 private _recordIdCounter;

    event PestDiseaseDetected(
        uint256 indexed recordId,
        address indexed reporter,
        string pestDiseaseType
    );

    event TreatmentApplied(
        uint256 indexed recordId,
        string treatmentMethod
    );

    constructor() Ownable(msg.sender) {}

    function recordPestDisease(
        uint256 plantationId,
        string memory pestDiseaseType,
        string memory severity
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = PestDiseaseRecord({
            recordId: recordId,
            plantationId: plantationId,
            pestDiseaseType: pestDiseaseType,
            severity: severity,
            detectionDate: block.timestamp,
            reporter: msg.sender,
            treated: false,
            treatmentMethod: ""
        });

        recordsByReporter[msg.sender].push(recordId);

        emit PestDiseaseDetected(recordId, msg.sender, pestDiseaseType);
        return recordId;
    }

    function applyTreatment(uint256 recordId, string memory treatmentMethod) public {
        require(!records[recordId].treated, "Already treated");
        records[recordId].treated = true;
        records[recordId].treatmentMethod = treatmentMethod;

        emit TreatmentApplied(recordId, treatmentMethod);
    }

    function getRecord(uint256 recordId) public view returns (PestDiseaseRecord memory) {
        return records[recordId];
    }
}

