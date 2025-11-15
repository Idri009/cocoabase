// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropGerminationTracking
 * @dev Onchain system for tracking seed germination rates and success
 */
contract FarmCropGerminationTracking is Ownable {
    struct GerminationRecord {
        uint256 recordId;
        uint256 seedBatchId;
        uint256 seedsPlanted;
        uint256 seedsGerminated;
        uint256 germinationRate;
        uint256 plantingDate;
        uint256 germinationDate;
        address farmer;
    }

    mapping(uint256 => GerminationRecord) public germinationRecords;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event GerminationRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        uint256 germinationRate
    );

    constructor() Ownable(msg.sender) {}

    function recordGermination(
        uint256 seedBatchId,
        uint256 seedsPlanted,
        uint256 seedsGerminated,
        uint256 germinationDate
    ) public returns (uint256) {
        require(seedsGerminated <= seedsPlanted, "Invalid germination count");
        uint256 germinationRate = (seedsGerminated * 100) / seedsPlanted;
        
        uint256 recordId = _recordIdCounter++;
        germinationRecords[recordId] = GerminationRecord({
            recordId: recordId,
            seedBatchId: seedBatchId,
            seedsPlanted: seedsPlanted,
            seedsGerminated: seedsGerminated,
            germinationRate: germinationRate,
            plantingDate: block.timestamp,
            germinationDate: germinationDate,
            farmer: msg.sender
        });

        recordsByFarmer[msg.sender].push(recordId);

        emit GerminationRecorded(recordId, msg.sender, germinationRate);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (GerminationRecord memory) {
        return germinationRecords[recordId];
    }

    function getRecordsByFarmer(address farmer) public view returns (uint256[] memory) {
        return recordsByFarmer[farmer];
    }
}

