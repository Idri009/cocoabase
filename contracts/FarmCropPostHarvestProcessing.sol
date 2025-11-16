// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropPostHarvestProcessing
 * @dev Onchain post-harvest processing and quality preservation tracking
 */
contract FarmCropPostHarvestProcessing is Ownable {
    struct ProcessingRecord {
        uint256 recordId;
        address farmer;
        string harvestBatchId;
        string processingType;
        uint256 processingDate;
        string processingMethod;
        uint256 qualityScore;
        string storageConditions;
    }

    mapping(uint256 => ProcessingRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event ProcessingRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string harvestBatchId,
        string processingType
    );

    constructor() Ownable(msg.sender) {}

    function recordProcessing(
        string memory harvestBatchId,
        string memory processingType,
        string memory processingMethod,
        uint256 qualityScore,
        string memory storageConditions
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = ProcessingRecord({
            recordId: recordId,
            farmer: msg.sender,
            harvestBatchId: harvestBatchId,
            processingType: processingType,
            processingDate: block.timestamp,
            processingMethod: processingMethod,
            qualityScore: qualityScore,
            storageConditions: storageConditions
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit ProcessingRecorded(recordId, msg.sender, harvestBatchId, processingType);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (ProcessingRecord memory) {
        return records[recordId];
    }
}

