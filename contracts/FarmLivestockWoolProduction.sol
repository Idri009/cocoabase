// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockWoolProduction
 * @dev Onchain system for tracking wool production and quality metrics
 */
contract FarmLivestockWoolProduction is Ownable {
    struct WoolProductionRecord {
        uint256 recordId;
        uint256 animalId;
        uint256 woolWeight;
        uint256 fiberDiameter;
        uint256 stapleLength;
        string woolGrade;
        uint256 shearingDate;
        address recorder;
    }

    mapping(uint256 => WoolProductionRecord) public woolProductionRecords;
    mapping(address => uint256[]) public recordsByRecorder;
    uint256 private _recordIdCounter;

    event WoolProductionRecorded(
        uint256 indexed recordId,
        address indexed recorder,
        uint256 woolWeight
    );

    constructor() Ownable(msg.sender) {}

    function recordWoolProduction(
        uint256 animalId,
        uint256 woolWeight,
        uint256 fiberDiameter,
        uint256 stapleLength,
        string memory woolGrade,
        uint256 shearingDate
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        woolProductionRecords[recordId] = WoolProductionRecord({
            recordId: recordId,
            animalId: animalId,
            woolWeight: woolWeight,
            fiberDiameter: fiberDiameter,
            stapleLength: stapleLength,
            woolGrade: woolGrade,
            shearingDate: shearingDate,
            recorder: msg.sender
        });

        recordsByRecorder[msg.sender].push(recordId);

        emit WoolProductionRecorded(recordId, msg.sender, woolWeight);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (WoolProductionRecord memory) {
        return woolProductionRecords[recordId];
    }
}

