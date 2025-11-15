// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropQualityGrading
 * @dev Onchain system for grading crop quality with standardized metrics
 */
contract FarmCropQualityGrading is Ownable {
    struct QualityGrade {
        uint256 gradeId;
        uint256 harvestId;
        uint256 qualityScore;
        string grade;
        string qualityMetrics;
        address grader;
    }

    mapping(uint256 => QualityGrade) public qualityGrades;
    mapping(address => uint256[]) public gradesByGrader;
    uint256 private _gradeIdCounter;

    event QualityGraded(
        uint256 indexed gradeId,
        address indexed grader,
        string grade
    );

    constructor() Ownable(msg.sender) {}

    function gradeQuality(
        uint256 harvestId,
        uint256 qualityScore,
        string memory grade,
        string memory qualityMetrics
    ) public returns (uint256) {
        require(qualityScore <= 100, "Invalid quality score");
        uint256 gradeId = _gradeIdCounter++;
        qualityGrades[gradeId] = QualityGrade({
            gradeId: gradeId,
            harvestId: harvestId,
            qualityScore: qualityScore,
            grade: grade,
            qualityMetrics: qualityMetrics,
            grader: msg.sender
        });

        gradesByGrader[msg.sender].push(gradeId);

        emit QualityGraded(gradeId, msg.sender, grade);
        return gradeId;
    }

    function getGrade(uint256 gradeId) public view returns (QualityGrade memory) {
        return qualityGrades[gradeId];
    }
}

