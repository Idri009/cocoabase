// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockWoolQualityAssessment
 * @dev Onchain wool quality assessment and fiber grading
 */
contract FarmLivestockWoolQualityAssessment is Ownable {
    struct WoolQuality {
        uint256 qualityId;
        address farmer;
        string livestockId;
        uint256 fiberDiameter;
        uint256 stapleLength;
        string grade;
        uint256 assessmentDate;
        address assessor;
    }

    mapping(uint256 => WoolQuality) public qualities;
    mapping(address => uint256[]) public qualitiesByFarmer;
    uint256 private _qualityIdCounter;

    event QualityAssessed(
        uint256 indexed qualityId,
        address indexed farmer,
        string livestockId,
        string grade
    );

    constructor() Ownable(msg.sender) {}

    function assessQuality(
        address farmer,
        string memory livestockId,
        uint256 fiberDiameter,
        uint256 stapleLength,
        string memory grade
    ) public onlyOwner returns (uint256) {
        uint256 qualityId = _qualityIdCounter++;
        qualities[qualityId] = WoolQuality({
            qualityId: qualityId,
            farmer: farmer,
            livestockId: livestockId,
            fiberDiameter: fiberDiameter,
            stapleLength: stapleLength,
            grade: grade,
            assessmentDate: block.timestamp,
            assessor: msg.sender
        });

        qualitiesByFarmer[farmer].push(qualityId);
        emit QualityAssessed(qualityId, farmer, livestockId, grade);
        return qualityId;
    }

    function getQuality(uint256 qualityId) public view returns (WoolQuality memory) {
        return qualities[qualityId];
    }
}

