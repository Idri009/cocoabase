// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockGeneticDiversityTracking
 * @dev Onchain genetic diversity tracking and conservation management
 */
contract FarmLivestockGeneticDiversityTracking is Ownable {
    struct DiversityRecord {
        uint256 recordId;
        address farmer;
        string breed;
        uint256 diversityIndex;
        uint256 populationSize;
        uint256 assessmentDate;
        string conservationStatus;
    }

    mapping(uint256 => DiversityRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event DiversityRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string breed,
        uint256 diversityIndex
    );

    constructor() Ownable(msg.sender) {}

    function recordDiversity(
        string memory breed,
        uint256 diversityIndex,
        uint256 populationSize,
        string memory conservationStatus
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = DiversityRecord({
            recordId: recordId,
            farmer: msg.sender,
            breed: breed,
            diversityIndex: diversityIndex,
            populationSize: populationSize,
            assessmentDate: block.timestamp,
            conservationStatus: conservationStatus
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit DiversityRecorded(recordId, msg.sender, breed, diversityIndex);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (DiversityRecord memory) {
        return records[recordId];
    }
}

