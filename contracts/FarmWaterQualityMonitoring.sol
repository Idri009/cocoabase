// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWaterQualityMonitoring
 * @dev Continuous water quality monitoring and alerts
 */
contract FarmWaterQualityMonitoring is Ownable {
    struct QualityRecord {
        uint256 recordId;
        address farmer;
        string sourceId;
        uint256 phLevel;
        uint256 dissolvedOxygen;
        uint256 turbidity;
        uint256 qualityScore;
        uint256 recordDate;
    }

    mapping(uint256 => QualityRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event QualityRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        uint256 qualityScore
    );

    constructor() Ownable(msg.sender) {}

    function recordQuality(
        string memory sourceId,
        uint256 phLevel,
        uint256 dissolvedOxygen,
        uint256 turbidity
    ) public returns (uint256) {
        uint256 qualityScore = (phLevel + dissolvedOxygen + (100 - turbidity)) / 3;
        uint256 recordId = _recordIdCounter++;
        records[recordId] = QualityRecord({
            recordId: recordId,
            farmer: msg.sender,
            sourceId: sourceId,
            phLevel: phLevel,
            dissolvedOxygen: dissolvedOxygen,
            turbidity: turbidity,
            qualityScore: qualityScore,
            recordDate: block.timestamp
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit QualityRecorded(recordId, msg.sender, qualityScore);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (QualityRecord memory) {
        return records[recordId];
    }
}
