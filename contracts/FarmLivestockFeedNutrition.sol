// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockFeedNutrition
 * @dev Feed nutrition analysis and tracking
 */
contract FarmLivestockFeedNutrition is Ownable {
    struct NutritionAnalysis {
        uint256 analysisId;
        address farmer;
        string feedType;
        uint256 energyValue;
        uint256 fiberContent;
        uint256 mineralContent;
        uint256 analysisDate;
    }

    mapping(uint256 => NutritionAnalysis) public analyses;
    uint256 private _analysisIdCounter;

    event AnalysisCreated(
        uint256 indexed analysisId,
        address indexed farmer,
        string feedType
    );

    constructor() Ownable(msg.sender) {}

    function createAnalysis(
        string memory feedType,
        uint256 energyValue,
        uint256 fiberContent,
        uint256 mineralContent
    ) public returns (uint256) {
        uint256 analysisId = _analysisIdCounter++;
        analyses[analysisId] = NutritionAnalysis({
            analysisId: analysisId,
            farmer: msg.sender,
            feedType: feedType,
            energyValue: energyValue,
            fiberContent: fiberContent,
            mineralContent: mineralContent,
            analysisDate: block.timestamp
        });

        emit AnalysisCreated(analysisId, msg.sender, feedType);
        return analysisId;
    }

    function getAnalysis(uint256 analysisId) public view returns (NutritionAnalysis memory) {
        return analyses[analysisId];
    }
}
