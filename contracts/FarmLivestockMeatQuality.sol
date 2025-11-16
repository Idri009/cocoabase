// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockMeatQuality
 * @dev Onchain system for grading meat quality and certification
 */
contract FarmLivestockMeatQuality is Ownable {
    struct MeatQualityGrade {
        uint256 gradeId;
        uint256 animalId;
        uint256 marblingScore;
        uint256 qualityScore;
        string grade;
        string certification;
        address grader;
    }

    mapping(uint256 => MeatQualityGrade) public meatQualityGrades;
    mapping(address => uint256[]) public gradesByGrader;
    uint256 private _gradeIdCounter;

    event MeatQualityGraded(
        uint256 indexed gradeId,
        address indexed grader,
        string grade
    );

    constructor() Ownable(msg.sender) {}

    function gradeMeatQuality(
        uint256 animalId,
        uint256 marblingScore,
        uint256 qualityScore,
        string memory grade,
        string memory certification
    ) public returns (uint256) {
        require(qualityScore <= 100, "Invalid quality score");
        uint256 gradeId = _gradeIdCounter++;
        meatQualityGrades[gradeId] = MeatQualityGrade({
            gradeId: gradeId,
            animalId: animalId,
            marblingScore: marblingScore,
            qualityScore: qualityScore,
            grade: grade,
            certification: certification,
            grader: msg.sender
        });

        gradesByGrader[msg.sender].push(gradeId);

        emit MeatQualityGraded(gradeId, msg.sender, grade);
        return gradeId;
    }

    function getGrade(uint256 gradeId) public view returns (MeatQualityGrade memory) {
        return meatQualityGrades[gradeId];
    }
}


