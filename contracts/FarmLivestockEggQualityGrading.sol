// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockEggQualityGrading
 * @dev Onchain egg quality grading and certification
 */
contract FarmLivestockEggQualityGrading is Ownable {
    struct EggQualityGrade {
        uint256 gradeId;
        address farmer;
        string livestockId;
        string grade;
        uint256 weight;
        string shellQuality;
        uint256 gradingDate;
        address grader;
    }

    mapping(uint256 => EggQualityGrade) public grades;
    mapping(address => uint256[]) public gradesByFarmer;
    uint256 private _gradeIdCounter;

    event GradeAssigned(
        uint256 indexed gradeId,
        address indexed farmer,
        string livestockId,
        string grade
    );

    constructor() Ownable(msg.sender) {}

    function assignGrade(
        address farmer,
        string memory livestockId,
        string memory grade,
        uint256 weight,
        string memory shellQuality
    ) public onlyOwner returns (uint256) {
        uint256 gradeId = _gradeIdCounter++;
        grades[gradeId] = EggQualityGrade({
            gradeId: gradeId,
            farmer: farmer,
            livestockId: livestockId,
            grade: grade,
            weight: weight,
            shellQuality: shellQuality,
            gradingDate: block.timestamp,
            grader: msg.sender
        });

        gradesByFarmer[farmer].push(gradeId);
        emit GradeAssigned(gradeId, farmer, livestockId, grade);
        return gradeId;
    }

    function getGrade(uint256 gradeId) public view returns (EggQualityGrade memory) {
        return grades[gradeId];
    }
}

