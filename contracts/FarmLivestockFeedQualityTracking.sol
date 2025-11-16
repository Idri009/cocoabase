// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockFeedQualityTracking
 * @dev Onchain feed quality and nutrition tracking
 */
contract FarmLivestockFeedQualityTracking is Ownable {
    struct QualityRecord {
        uint256 recordId;
        address farmer;
        string feedBatchId;
        uint256 proteinContent;
        uint256 fiberContent;
        uint256 moistureContent;
        uint256 recordDate;
        string grade;
        bool meetsStandard;
    }

    mapping(uint256 => QualityRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event QualityRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string feedBatchId,
        string grade
    );

    constructor() Ownable(msg.sender) {}

    function recordQuality(
        string memory feedBatchId,
        uint256 proteinContent,
        uint256 fiberContent,
        uint256 moistureContent,
        string memory grade
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        bool meetsStandard = moistureContent < 15 && proteinContent > 10;

        records[recordId] = QualityRecord({
            recordId: recordId,
            farmer: msg.sender,
            feedBatchId: feedBatchId,
            proteinContent: proteinContent,
            fiberContent: fiberContent,
            moistureContent: moistureContent,
            recordDate: block.timestamp,
            grade: grade,
            meetsStandard: meetsStandard
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit QualityRecorded(recordId, msg.sender, feedBatchId, grade);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (QualityRecord memory) {
        return records[recordId];
    }
}

