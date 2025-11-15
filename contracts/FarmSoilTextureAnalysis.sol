// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilTextureAnalysis
 * @dev Onchain system for analyzing soil texture composition
 */
contract FarmSoilTextureAnalysis is Ownable {
    struct TextureAnalysis {
        uint256 analysisId;
        uint256 fieldId;
        uint256 sandPercentage;
        uint256 siltPercentage;
        uint256 clayPercentage;
        string textureClass;
        uint256 analysisDate;
        address analyst;
    }

    mapping(uint256 => TextureAnalysis) public textureAnalyses;
    mapping(address => uint256[]) public analysesByAnalyst;
    uint256 private _analysisIdCounter;

    event TextureAnalysisRecorded(
        uint256 indexed analysisId,
        address indexed analyst,
        string textureClass
    );

    constructor() Ownable(msg.sender) {}

    function recordTextureAnalysis(
        uint256 fieldId,
        uint256 sandPercentage,
        uint256 siltPercentage,
        uint256 clayPercentage,
        string memory textureClass,
        uint256 analysisDate
    ) public returns (uint256) {
        require(sandPercentage + siltPercentage + clayPercentage == 100, "Percentages must sum to 100");
        uint256 analysisId = _analysisIdCounter++;
        textureAnalyses[analysisId] = TextureAnalysis({
            analysisId: analysisId,
            fieldId: fieldId,
            sandPercentage: sandPercentage,
            siltPercentage: siltPercentage,
            clayPercentage: clayPercentage,
            textureClass: textureClass,
            analysisDate: analysisDate,
            analyst: msg.sender
        });

        analysesByAnalyst[msg.sender].push(analysisId);

        emit TextureAnalysisRecorded(analysisId, msg.sender, textureClass);
        return analysisId;
    }

    function getAnalysis(uint256 analysisId) public view returns (TextureAnalysis memory) {
        return textureAnalyses[analysisId];
    }
}

