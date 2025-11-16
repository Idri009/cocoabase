// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockWelfareAssessment
 * @dev Onchain welfare assessment and compliance monitoring
 */
contract FarmLivestockWelfareAssessment is Ownable {
    struct WelfareAssessment {
        uint256 assessmentId;
        address farmer;
        string livestockId;
        uint256 welfareScore;
        string assessmentCriteria;
        uint256 assessmentDate;
        address assessor;
        bool isCompliant;
    }

    mapping(uint256 => WelfareAssessment) public assessments;
    mapping(address => uint256[]) public assessmentsByFarmer;
    uint256 private _assessmentIdCounter;

    event AssessmentRecorded(
        uint256 indexed assessmentId,
        address indexed farmer,
        string livestockId,
        uint256 welfareScore
    );

    constructor() Ownable(msg.sender) {}

    function recordAssessment(
        address farmer,
        string memory livestockId,
        uint256 welfareScore,
        string memory assessmentCriteria,
        bool isCompliant
    ) public onlyOwner returns (uint256) {
        uint256 assessmentId = _assessmentIdCounter++;
        assessments[assessmentId] = WelfareAssessment({
            assessmentId: assessmentId,
            farmer: farmer,
            livestockId: livestockId,
            welfareScore: welfareScore,
            assessmentCriteria: assessmentCriteria,
            assessmentDate: block.timestamp,
            assessor: msg.sender,
            isCompliant: isCompliant
        });

        assessmentsByFarmer[farmer].push(assessmentId);
        emit AssessmentRecorded(assessmentId, farmer, livestockId, welfareScore);
        return assessmentId;
    }

    function getAssessment(uint256 assessmentId) public view returns (WelfareAssessment memory) {
        return assessments[assessmentId];
    }
}

