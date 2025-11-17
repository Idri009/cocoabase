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
        string fieldId;
        uint256 actualYield;
        uint256 expectedYield;
        uint256 yieldDifference;
        uint256 analysisDate;
        string factors;
    }

    mapping(uint256 => YieldAnalysis) public analyses;
    mapping(address => uint256[]) public analysesByFarmer;
    uint256 private _analysisIdCounter;

    event AnalysisRecorded(
        uint256 indexed analysisId,
        address indexed farmer,
        string fieldId,
        uint256 actualYield
    );

    constructor() Ownable(msg.sender) {}

    function recordAnalysis(
        string memory fieldId,
        uint256 actualYield,
        uint256 expectedYield,
        string memory factors
    ) public returns (uint256) {
        uint256 analysisId = _analysisIdCounter++;
        uint256 yieldDifference = actualYield > expectedYield 
            ? actualYield - expectedYield 
            : expectedYield - actualYield;

        analyses[analysisId] = YieldAnalysis({
            analysisId: analysisId,
            farmer: msg.sender,
            fieldId: fieldId,
            actualYield: actualYield,
            expectedYield: expectedYield,
            yieldDifference: yieldDifference,
            analysisDate: block.timestamp,
            factors: factors
        });

        analysesByFarmer[msg.sender].push(analysisId);
        emit AnalysisRecorded(analysisId, msg.sender, fieldId, actualYield);
        return analysisId;
    }

    function getAnalysis(uint256 analysisId) public view returns (YieldAnalysis memory) {
        return analyses[analysisId];
    }
}
