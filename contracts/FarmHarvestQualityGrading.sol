// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmHarvestQualityGrading
 * @dev Quality grading system for harvest products
 */
contract FarmHarvestQualityGrading is Ownable {
    struct Grade {
        uint256 gradeId;
        address farmer;
        string productId;
        uint256 qualityScore;
        string gradeLevel;
        uint256 gradingDate;
    }

    mapping(uint256 => Grade) public grades;
    mapping(address => uint256[]) public gradesByFarmer;
    uint256 private _gradeIdCounter;

    event ProductGraded(
        uint256 indexed gradeId,
        address indexed farmer,
        string gradeLevel
    );

    constructor() Ownable(msg.sender) {}

    function gradeProduct(
        string memory productId,
        uint256 qualityScore,
        string memory gradeLevel
    ) public returns (uint256) {
        uint256 gradeId = _gradeIdCounter++;
        grades[gradeId] = Grade({
            gradeId: gradeId,
            farmer: msg.sender,
            productId: productId,
            qualityScore: qualityScore,
            gradeLevel: gradeLevel,
            gradingDate: block.timestamp
        });

        gradesByFarmer[msg.sender].push(gradeId);
        emit ProductGraded(gradeId, msg.sender, gradeLevel);
        return gradeId;
    }

    function getGrade(uint256 gradeId) public view returns (Grade memory) {
        return grades[gradeId];
    }
}
