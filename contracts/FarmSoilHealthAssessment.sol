// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilHealthAssessment
 * @dev Comprehensive soil health assessment and scoring
 */
contract FarmSoilHealthAssessment is Ownable {
    struct Assessment {
        uint256 assessmentId;
        address farmer;
        string fieldId;
        uint256 healthScore;
        uint256 organicMatter;
        uint256 biodiversity;
        uint256 assessmentDate;
    }

    mapping(uint256 => Assessment) public assessments;
    mapping(address => uint256[]) public assessmentsByFarmer;
    uint256 private _assessmentIdCounter;

    event AssessmentCreated(
        uint256 indexed assessmentId,
        address indexed farmer,
        uint256 healthScore
    );

    constructor() Ownable(msg.sender) {}

    function createAssessment(
        string memory fieldId,
        uint256 healthScore,
        uint256 organicMatter,
        uint256 biodiversity
    ) public returns (uint256) {
        uint256 assessmentId = _assessmentIdCounter++;
        assessments[assessmentId] = Assessment({
            assessmentId: assessmentId,
            farmer: msg.sender,
            fieldId: fieldId,
            healthScore: healthScore,
            organicMatter: organicMatter,
            biodiversity: biodiversity,
            assessmentDate: block.timestamp
        });

        assessmentsByFarmer[msg.sender].push(assessmentId);
        emit AssessmentCreated(assessmentId, msg.sender, healthScore);
        return assessmentId;
    }

    function getAssessment(uint256 assessmentId) public view returns (Assessment memory) {
        return assessments[assessmentId];
    }
}
