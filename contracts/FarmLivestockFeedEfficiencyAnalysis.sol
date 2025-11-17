// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockFeedEfficiencyAnalysis
 * @dev Feed efficiency analysis and optimization
 */
contract FarmLivestockFeedEfficiencyAnalysis is Ownable {
    struct EfficiencyAnalysis {
        uint256 analysisId;
        address farmer;
        string livestockId;
        uint256 feedConsumed;
        uint256 weightGained;
        uint256 efficiencyRatio;
        uint256 analysisDate;
    }

    mapping(uint256 => EfficiencyAnalysis) public analyses;
    uint256 private _analysisIdCounter;

    event AnalysisCreated(
        uint256 indexed analysisId,
        address indexed farmer,
        uint256 efficiencyRatio
    );

    constructor() Ownable(msg.sender) {}

    function createAnalysis(
        string memory livestockId,
        uint256 feedConsumed,
        uint256 weightGained
    ) public returns (uint256) {
        require(feedConsumed > 0, "Invalid feed amount");
        uint256 efficiencyRatio = (weightGained * 10000) / feedConsumed;
        uint256 analysisId = _analysisIdCounter++;
        analyses[analysisId] = EfficiencyAnalysis({
            analysisId: analysisId,
            farmer: msg.sender,
            livestockId: livestockId,
            feedConsumed: feedConsumed,
            weightGained: weightGained,
            efficiencyRatio: efficiencyRatio,
            analysisDate: block.timestamp
        });

        emit AnalysisCreated(analysisId, msg.sender, efficiencyRatio);
        return analysisId;
    }

    function getAnalysis(uint256 analysisId) public view returns (EfficiencyAnalysis memory) {
        return analyses[analysisId];
    }
}
