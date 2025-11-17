// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropWeatherImpact
 * @dev Weather impact assessment on crops
 */
contract FarmCropWeatherImpact is Ownable {
    struct ImpactAssessment {
        uint256 assessmentId;
        address farmer;
        string fieldId;
        string weatherEvent;
        uint256 impactSeverity;
        uint256 cropDamage;
        uint256 assessmentDate;
    }

    mapping(uint256 => ImpactAssessment) public assessments;
    mapping(address => uint256[]) public assessmentsByFarmer;
    uint256 private _assessmentIdCounter;

    event AssessmentCreated(
        uint256 indexed assessmentId,
        address indexed farmer,
        string weatherEvent
    );

    constructor() Ownable(msg.sender) {}

    function createAssessment(
        string memory fieldId,
        string memory weatherEvent,
        uint256 impactSeverity,
        uint256 cropDamage
    ) public returns (uint256) {
        uint256 assessmentId = _assessmentIdCounter++;
        assessments[assessmentId] = ImpactAssessment({
            assessmentId: assessmentId,
            farmer: msg.sender,
            fieldId: fieldId,
            weatherEvent: weatherEvent,
            impactSeverity: impactSeverity,
            cropDamage: cropDamage,
            assessmentDate: block.timestamp
        });

        assessmentsByFarmer[msg.sender].push(assessmentId);
        emit AssessmentCreated(assessmentId, msg.sender, weatherEvent);
        return assessmentId;
    }

    function getAssessment(uint256 assessmentId) public view returns (ImpactAssessment memory) {
        return assessments[assessmentId];
    }
}