// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropWaterEfficiencyOptimization
 * @dev Onchain water efficiency optimization and usage analysis
 */
contract FarmCropWaterEfficiencyOptimization is Ownable {
    struct EfficiencyAnalysis {
        uint256 analysisId;
        address farmer;
        string fieldId;
        uint256 waterUsed;
        uint256 cropYield;
        uint256 efficiencyRatio;
        uint256 analysisDate;
        string recommendations;
    }

    mapping(uint256 => EfficiencyAnalysis) public analyses;
    mapping(address => uint256[]) public analysesByFarmer;
    uint256 private _analysisIdCounter;

    event AnalysisRecorded(
        uint256 indexed analysisId,
        address indexed farmer,
        string fieldId,
        uint256 efficiencyRatio
    );

    constructor() Ownable(msg.sender) {}

    function recordAnalysis(
        string memory fieldId,
        uint256 waterUsed,
        uint256 cropYield,
        string memory recommendations
    ) public returns (uint256) {
        uint256 analysisId = _analysisIdCounter++;
        uint256 efficiencyRatio = (cropYield * 100) / waterUsed;

        analyses[analysisId] = EfficiencyAnalysis({
            analysisId: analysisId,
            farmer: msg.sender,
            fieldId: fieldId,
            waterUsed: waterUsed,
            cropYield: cropYield,
            efficiencyRatio: efficiencyRatio,
            analysisDate: block.timestamp,
            recommendations: recommendations
        });

        analysesByFarmer[msg.sender].push(analysisId);
        emit AnalysisRecorded(analysisId, msg.sender, fieldId, efficiencyRatio);
        return analysisId;
    }

    function getAnalysis(uint256 analysisId) public view returns (EfficiencyAnalysis memory) {
        return analyses[analysisId];
    }
}

