// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropQualityIndex
 * @dev Crop quality index calculation and tracking
 */
contract FarmCropQualityIndex is Ownable {
    struct CropQuality {
        uint256 qualityId;
        uint256 cropId;
        uint256 appearanceScore;
        uint256 sizeScore;
        uint256 maturityScore;
        uint256 overallScore;
        uint256 timestamp;
    }

    mapping(uint256 => CropQuality) public cropQualities;
    mapping(uint256 => uint256[]) public qualitiesByCrop;
    uint256 private _qualityIdCounter;

    event CropQualityCalculated(
        uint256 indexed qualityId,
        uint256 cropId,
        uint256 overallScore
    );

    constructor() Ownable(msg.sender) {}

    function calculateQuality(
        uint256 cropId,
        uint256 appearanceScore,
        uint256 sizeScore,
        uint256 maturityScore
    ) public returns (uint256) {
        uint256 overallScore = (appearanceScore + sizeScore + maturityScore) / 3;
        uint256 qualityId = _qualityIdCounter++;
        cropQualities[qualityId] = CropQuality({
            qualityId: qualityId,
            cropId: cropId,
            appearanceScore: appearanceScore,
            sizeScore: sizeScore,
            maturityScore: maturityScore,
            overallScore: overallScore,
            timestamp: block.timestamp
        });
        qualitiesByCrop[cropId].push(qualityId);
        emit CropQualityCalculated(qualityId, cropId, overallScore);
        return qualityId;
    }

    function getLatestQuality(uint256 cropId) public view returns (CropQuality memory) {
        require(qualitiesByCrop[cropId].length > 0, "No qualities found");
        uint256 latestId = qualitiesByCrop[cropId][qualitiesByCrop[cropId].length - 1];
        return cropQualities[latestId];
    }
}
