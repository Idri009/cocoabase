// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropQualityGradingSystem
 * @dev Onchain standardized quality grading system
 */
contract FarmCropQualityGradingSystem is Ownable {
    struct QualityGrade {
        uint256 gradeId;
        address farmer;
        string cropBatchId;
        string grade;
        uint256 score;
        string criteria;
        uint256 gradingDate;
        address grader;
    }

    mapping(uint256 => QualityGrade) public grades;
    mapping(address => uint256[]) public gradesByFarmer;
    uint256 private _gradeIdCounter;

    event GradeAssigned(
        uint256 indexed gradeId,
        address indexed farmer,
        string cropBatchId,
        string grade
    );

    constructor() Ownable(msg.sender) {}

    function assignGrade(
        address farmer,
        string memory cropBatchId,
        string memory grade,
        uint256 score,
        string memory criteria
    ) public onlyOwner returns (uint256) {
        uint256 gradeId = _gradeIdCounter++;
        grades[gradeId] = QualityGrade({
            gradeId: gradeId,
            farmer: farmer,
            cropBatchId: cropBatchId,
            grade: grade,
            score: score,
            criteria: criteria,
            gradingDate: block.timestamp,
            grader: msg.sender
        });

        gradesByFarmer[farmer].push(gradeId);
        emit GradeAssigned(gradeId, farmer, cropBatchId, grade);
        return gradeId;
    }

    function getGrade(uint256 gradeId) public view returns (QualityGrade memory) {
        return grades[gradeId];
    }
}

