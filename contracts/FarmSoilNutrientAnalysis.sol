// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilNutrientAnalysis
 * @dev Onchain comprehensive soil nutrient analysis
 */
contract FarmSoilNutrientAnalysis is Ownable {
    struct NutrientAnalysis {
        uint256 analysisId;
        address farmer;
        string fieldId;
        uint256 nitrogen;
        uint256 phosphorus;
        uint256 potassium;
        uint256 calcium;
        uint256 magnesium;
        uint256 analysisDate;
        string recommendations;
    }

    mapping(uint256 => NutrientAnalysis) public analyses;
    mapping(address => uint256[]) public analysesByFarmer;
    uint256 private _analysisIdCounter;

    event AnalysisRecorded(
        uint256 indexed analysisId,
        address indexed farmer,
        string fieldId
    );

    constructor() Ownable(msg.sender) {}

    function recordAnalysis(
        string memory fieldId,
        uint256 nitrogen,
        uint256 phosphorus,
        uint256 potassium,
        uint256 calcium,
        uint256 magnesium,
        string memory recommendations
    ) public returns (uint256) {
        uint256 analysisId = _analysisIdCounter++;
        analyses[analysisId] = NutrientAnalysis({
            analysisId: analysisId,
            farmer: msg.sender,
            fieldId: fieldId,
            nitrogen: nitrogen,
            phosphorus: phosphorus,
            potassium: potassium,
            calcium: calcium,
            magnesium: magnesium,
            analysisDate: block.timestamp,
            recommendations: recommendations
        });

        analysesByFarmer[msg.sender].push(analysisId);
        emit AnalysisRecorded(analysisId, msg.sender, fieldId);
        return analysisId;
    }

    function getAnalysis(uint256 analysisId) public view returns (NutrientAnalysis memory) {
        return analyses[analysisId];
    }
}
