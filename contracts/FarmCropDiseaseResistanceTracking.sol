// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropDiseaseResistanceTracking
 * @dev Onchain crop disease resistance monitoring
 */
contract FarmCropDiseaseResistanceTracking is Ownable {
    struct ResistanceRecord {
        uint256 recordId;
        address farmer;
        string cropVariety;
        string diseaseType;
        uint256 resistanceLevel;
        uint256 assessmentDate;
        string geneticMarkers;
    }

    mapping(uint256 => ResistanceRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event ResistanceRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string cropVariety,
        string diseaseType
    );

    constructor() Ownable(msg.sender) {}

    function recordResistance(
        string memory cropVariety,
        string memory diseaseType,
        uint256 resistanceLevel,
        string memory geneticMarkers
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = ResistanceRecord({
            recordId: recordId,
            farmer: msg.sender,
            cropVariety: cropVariety,
            diseaseType: diseaseType,
            resistanceLevel: resistanceLevel,
            assessmentDate: block.timestamp,
            geneticMarkers: geneticMarkers
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit ResistanceRecorded(recordId, msg.sender, cropVariety, diseaseType);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (ResistanceRecord memory) {
        return records[recordId];
    }
}

