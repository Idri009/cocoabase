// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockBehaviorAnalysis
 * @dev Onchain behavior analysis and welfare indicators
 */
contract FarmLivestockBehaviorAnalysis is Ownable {
    struct BehaviorAnalysis {
        uint256 analysisId;
        address farmer;
        string livestockId;
        string behaviorType;
        string observation;
        uint256 observationDate;
        string welfareIndicator;
    }

    mapping(uint256 => BehaviorAnalysis) public analyses;
    mapping(address => uint256[]) public analysesByFarmer;
    uint256 private _analysisIdCounter;

    event AnalysisRecorded(
        uint256 indexed analysisId,
        address indexed farmer,
        string livestockId,
        string behaviorType
    );

    constructor() Ownable(msg.sender) {}

    function recordAnalysis(
        string memory livestockId,
        string memory behaviorType,
        string memory observation,
        string memory welfareIndicator
    ) public returns (uint256) {
        uint256 analysisId = _analysisIdCounter++;
        analyses[analysisId] = BehaviorAnalysis({
            analysisId: analysisId,
            farmer: msg.sender,
            livestockId: livestockId,
            behaviorType: behaviorType,
            observation: observation,
            observationDate: block.timestamp,
            welfareIndicator: welfareIndicator
        });

        analysesByFarmer[msg.sender].push(analysisId);
        emit AnalysisRecorded(analysisId, msg.sender, livestockId, behaviorType);
        return analysisId;
    }

    function getAnalysis(uint256 analysisId) public view returns (BehaviorAnalysis memory) {
        return analyses[analysisId];
    }
}

