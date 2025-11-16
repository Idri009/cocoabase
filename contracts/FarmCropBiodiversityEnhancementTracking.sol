// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropBiodiversityEnhancementTracking
 * @dev Onchain crop biodiversity enhancement tracking
 */
contract FarmCropBiodiversityEnhancementTracking is Ownable {
    struct EnhancementRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        string enhancementType;
        uint256 implementationDate;
        uint256 biodiversityScore;
        string speciesAdded;
        uint256 impact;
    }

    mapping(uint256 => EnhancementRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event EnhancementRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        string enhancementType
    );

    constructor() Ownable(msg.sender) {}

    function recordEnhancement(
        string memory fieldId,
        string memory enhancementType,
        uint256 biodiversityScore,
        string memory speciesAdded,
        uint256 impact
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = EnhancementRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            enhancementType: enhancementType,
            implementationDate: block.timestamp,
            biodiversityScore: biodiversityScore,
            speciesAdded: speciesAdded,
            impact: impact
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit EnhancementRecorded(recordId, msg.sender, fieldId, enhancementType);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (EnhancementRecord memory) {
        return records[recordId];
    }
}

