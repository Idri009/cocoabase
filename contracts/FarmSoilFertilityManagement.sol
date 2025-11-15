// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilFertilityManagement
 * @dev Manage and track soil fertility levels
 */
contract FarmSoilFertilityManagement is Ownable {
    struct FertilityAssessment {
        uint256 assessmentId;
        uint256 fieldId;
        uint256 nitrogenLevel;
        uint256 phosphorusLevel;
        uint256 potassiumLevel;
        uint256 organicMatter;
        uint256 phLevel;
        uint256 assessedDate;
        address assessor;
    }

    struct FertilityImprovement {
        uint256 improvementId;
        uint256 assessmentId;
        string improvementMethod;
        uint256 expectedImprovement;
        uint256 implementationDate;
        address implementer;
        bool completed;
    }

    mapping(uint256 => FertilityAssessment) public fertilityAssessments;
    mapping(uint256 => FertilityImprovement) public fertilityImprovements;
    mapping(address => uint256[]) public assessmentsByOwner;
    uint256 private _assessmentIdCounter;
    uint256 private _improvementIdCounter;

    event FertilityAssessed(
        uint256 indexed assessmentId,
        address indexed owner,
        uint256 fieldId
    );

    event ImprovementImplemented(
        uint256 indexed improvementId,
        uint256 indexed assessmentId
    );

    constructor() Ownable(msg.sender) {}

    function assessFertility(
        uint256 fieldId,
        uint256 nitrogenLevel,
        uint256 phosphorusLevel,
        uint256 potassiumLevel,
        uint256 organicMatter,
        uint256 phLevel
    ) public returns (uint256) {
        uint256 assessmentId = _assessmentIdCounter++;
        fertilityAssessments[assessmentId] = FertilityAssessment({
            assessmentId: assessmentId,
            fieldId: fieldId,
            nitrogenLevel: nitrogenLevel,
            phosphorusLevel: phosphorusLevel,
            potassiumLevel: potassiumLevel,
            organicMatter: organicMatter,
            phLevel: phLevel,
            assessedDate: block.timestamp,
            assessor: msg.sender
        });

        assessmentsByOwner[msg.sender].push(assessmentId);

        emit FertilityAssessed(assessmentId, msg.sender, fieldId);
        return assessmentId;
    }

    function implementImprovement(
        uint256 assessmentId,
        string memory improvementMethod,
        uint256 expectedImprovement
    ) public returns (uint256) {
        require(fertilityAssessments[assessmentId].assessor == msg.sender, "Not assessor");
        
        uint256 improvementId = _improvementIdCounter++;
        fertilityImprovements[improvementId] = FertilityImprovement({
            improvementId: improvementId,
            assessmentId: assessmentId,
            improvementMethod: improvementMethod,
            expectedImprovement: expectedImprovement,
            implementationDate: block.timestamp,
            implementer: msg.sender,
            completed: false
        });

        emit ImprovementImplemented(improvementId, assessmentId);
        return improvementId;
    }

    function completeImprovement(uint256 improvementId) public {
        require(fertilityImprovements[improvementId].implementer == msg.sender, "Not implementer");
        fertilityImprovements[improvementId].completed = true;
    }

    function getFertilityAssessment(uint256 assessmentId) public view returns (FertilityAssessment memory) {
        return fertilityAssessments[assessmentId];
    }

    function getAssessmentsByOwner(address owner) public view returns (uint256[] memory) {
        return assessmentsByOwner[owner];
    }
}


