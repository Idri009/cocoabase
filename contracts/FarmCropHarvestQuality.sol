// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropHarvestQuality
 * @dev Onchain system for tracking harvest quality grades
 */
contract FarmCropHarvestQuality is Ownable {
    struct QualityGrade {
        uint256 gradeId;
        uint256 harvestId;
        string grade;
        uint256 score;
        address grader;
        uint256 gradeDate;
        bool verified;
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

    function gradeHarvest(
        uint256 harvestId,
        string memory grade,
        uint256 score
    ) public returns (uint256) {
        uint256 gradeId = _gradeIdCounter++;
        qualityGrades[gradeId] = QualityGrade({
            gradeId: gradeId,
            harvestId: harvestId,
            grade: grade,
            score: score,
            grader: msg.sender,
            gradeDate: block.timestamp,
            verified: false
        });

        gradesByGrader[msg.sender].push(gradeId);

        emit QualityGraded(gradeId, msg.sender, grade);
        return gradeId;
    }

    function verifyGrade(uint256 gradeId) public onlyOwner {
        qualityGrades[gradeId].verified = true;
    }

    function getGrade(uint256 gradeId) public view returns (QualityGrade memory) {
        return qualityGrades[gradeId];
    }
}


