// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilQualityIndex
 * @dev Onchain soil quality index calculation and tracking
 */
contract FarmSoilQualityIndex is Ownable {
    struct SoilQualityRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        uint256 phLevel;
        uint256 organicMatter;
        uint256 nutrientLevel;
        uint256 qualityScore;
        uint256 timestamp;
    }

    mapping(uint256 => SoilQualityRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    mapping(address => uint256) public averageQualityByFarmer;
    uint256 private _recordIdCounter;

    event SoilQualityRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        uint256 qualityScore
    );

    constructor() Ownable(msg.sender) {}

    function recordSoilQuality(
        string memory fieldId,
        uint256 phLevel,
        uint256 organicMatter,
        uint256 nutrientLevel
    ) public returns (uint256) {
        require(phLevel > 0 && phLevel <= 14, "Invalid pH level");
        require(organicMatter >= 0, "Invalid organic matter");
        require(nutrientLevel >= 0, "Invalid nutrient level");

        uint256 recordId = _recordIdCounter++;
        uint256 qualityScore = calculateQualityScore(phLevel, organicMatter, nutrientLevel);

        records[recordId] = SoilQualityRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            phLevel: phLevel,
            organicMatter: organicMatter,
            nutrientLevel: nutrientLevel,
            qualityScore: qualityScore,
            timestamp: block.timestamp
        });

        recordsByFarmer[msg.sender].push(recordId);
        updateAverageQuality(msg.sender, qualityScore);

        emit SoilQualityRecorded(recordId, msg.sender, fieldId, qualityScore);
        return recordId;
    }

    function calculateQualityScore(uint256 ph, uint256 organicMatter, uint256 nutrients) internal pure returns (uint256) {
        uint256 phScore = (ph >= 6 && ph <= 7) ? 100 : 50;
        uint256 organicScore = organicMatter * 10;
        uint256 nutrientScore = nutrients;
        return (phScore + organicScore + nutrientScore) / 3;
    }

    function updateAverageQuality(address farmer, uint256 newScore) internal {
        uint256 count = recordsByFarmer[farmer].length;
        averageQualityByFarmer[farmer] = ((averageQualityByFarmer[farmer] * (count - 1)) + newScore) / count;
    }

    function getRecord(uint256 recordId) public view returns (SoilQualityRecord memory) {
        return records[recordId];
    }

    function getAverageQuality(address farmer) public view returns (uint256) {
        return averageQualityByFarmer[farmer];
    }
}

