// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropYieldAnalysis
 * @dev Onchain yield analysis and comparative reporting
 */
contract FarmCropYieldAnalysis is Ownable {
    struct YieldAnalysis {
        uint256 analysisId;
        address farmer;
        string cropType;
        string fieldId;
        uint256 yield;
        uint256 area;
        uint256 yieldPerHectare;
        uint256 season;
        uint256 analysisDate;
    }

    mapping(uint256 => YieldAnalysis) public analyses;
    mapping(address => uint256[]) public analysesByFarmer;
    uint256 private _analysisIdCounter;

    event AnalysisRecorded(
        uint256 indexed analysisId,
        address indexed farmer,
        string cropType,
        uint256 yieldPerHectare
    );

    constructor() Ownable(msg.sender) {}

    function recordAnalysis(
        string memory cropType,
        string memory fieldId,
        uint256 yield,
        uint256 area,
        uint256 season
    ) public returns (uint256) {
        uint256 analysisId = _analysisIdCounter++;
        uint256 yieldPerHectare = (yield * 10000) / area;

        analyses[analysisId] = YieldAnalysis({
            analysisId: analysisId,
            farmer: msg.sender,
            cropType: cropType,
            fieldId: fieldId,
            yield: yield,
            area: area,
            yieldPerHectare: yieldPerHectare,
            season: season,
            analysisDate: block.timestamp
        });

        analysesByFarmer[msg.sender].push(analysisId);
        emit AnalysisRecorded(analysisId, msg.sender, cropType, yieldPerHectare);
        return analysisId;
    }

    function getAnalysis(uint256 analysisId) public view returns (YieldAnalysis memory) {
        return analyses[analysisId];
    }
}

