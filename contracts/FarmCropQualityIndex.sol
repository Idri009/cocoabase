// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropQualityIndex
 * @dev Onchain crop quality index calculation and tracking
 */
contract FarmCropQualityIndex is Ownable {
    struct CropQualityRecord {
        uint256 recordId;
        address farmer;
        string cropType;
        uint256 sizeScore;
        uint256 colorScore;
        uint256 textureScore;
        uint256 overallQuality;
        uint256 timestamp;
    }

    mapping(uint256 => CropQualityRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    mapping(address => uint256) public averageQualityByFarmer;
    uint256 private _recordIdCounter;

    event CropQualityRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string cropType,
        uint256 overallQuality
    );

    constructor() Ownable(msg.sender) {}

    function recordCropQuality(
        string memory cropType,
        uint256 sizeScore,
        uint256 colorScore,
        uint256 textureScore
    ) public returns (uint256) {
        require(sizeScore > 0 && sizeScore <= 100, "Invalid size score");
        require(colorScore > 0 && colorScore <= 100, "Invalid color score");
        require(textureScore > 0 && textureScore <= 100, "Invalid texture score");

        uint256 recordId = _recordIdCounter++;
        uint256 overallQuality = (sizeScore + colorScore + textureScore) / 3;

        records[recordId] = CropQualityRecord({
            recordId: recordId,
            farmer: msg.sender,
            cropType: cropType,
            sizeScore: sizeScore,
            colorScore: colorScore,
            textureScore: textureScore,
            overallQuality: overallQuality,
            timestamp: block.timestamp
        });

        recordsByFarmer[msg.sender].push(recordId);
        updateAverageQuality(msg.sender, overallQuality);

        emit CropQualityRecorded(recordId, msg.sender, cropType, overallQuality);
        return recordId;
    }

    function updateAverageQuality(address farmer, uint256 newScore) internal {
        uint256 count = recordsByFarmer[farmer].length;
        averageQualityByFarmer[farmer] = ((averageQualityByFarmer[farmer] * (count - 1)) + newScore) / count;
    }

    function getRecord(uint256 recordId) public view returns (CropQualityRecord memory) {
        return records[recordId];
    }

    function getAverageQuality(address farmer) public view returns (uint256) {
        return averageQualityByFarmer[farmer];
    }
}

