// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilTextureAnalysis
 * @dev Onchain soil texture composition analysis
 */
contract FarmSoilTextureAnalysis is Ownable {
    struct TextureAnalysis {
        uint256 analysisId;
        address farmer;
        string fieldId;
        uint256 sandPercentage;
        uint256 siltPercentage;
        uint256 clayPercentage;
        string textureClass;
        uint256 analysisDate;
        string recommendations;
    }

    mapping(uint256 => TextureAnalysis) public analyses;
    mapping(address => uint256[]) public analysesByFarmer;
    uint256 private _analysisIdCounter;

    event AnalysisRecorded(
        uint256 indexed analysisId,
        address indexed farmer,
        string fieldId,
        string textureClass
    );

    constructor() Ownable(msg.sender) {}

    function recordAnalysis(
        string memory fieldId,
        uint256 sandPercentage,
        uint256 siltPercentage,
        uint256 clayPercentage,
        string memory textureClass,
        string memory recommendations
    ) public returns (uint256) {
        uint256 analysisId = _analysisIdCounter++;
        analyses[analysisId] = TextureAnalysis({
            analysisId: analysisId,
            farmer: msg.sender,
            fieldId: fieldId,
            sandPercentage: sandPercentage,
            siltPercentage: siltPercentage,
            clayPercentage: clayPercentage,
            textureClass: textureClass,
            analysisDate: block.timestamp,
            recommendations: recommendations
        });

        analysesByFarmer[msg.sender].push(analysisId);
        emit AnalysisRecorded(analysisId, msg.sender, fieldId, textureClass);
        return analysisId;
    }

    function getAnalysis(uint256 analysisId) public view returns (TextureAnalysis memory) {
        return analyses[analysisId];
    }
}
