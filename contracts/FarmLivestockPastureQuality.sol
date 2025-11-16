// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockPastureQuality
 * @dev Onchain pasture quality assessment and management
 */
contract FarmLivestockPastureQuality is Ownable {
    struct PastureQuality {
        uint256 qualityId;
        address farmer;
        string pastureId;
        uint256 forageQuality;
        uint256 carryingCapacity;
        uint256 assessmentDate;
        string condition;
        string recommendations;
    }

    mapping(uint256 => PastureQuality) public qualities;
    mapping(address => uint256[]) public qualitiesByFarmer;
    uint256 private _qualityIdCounter;

    event QualityAssessed(
        uint256 indexed qualityId,
        address indexed farmer,
        string pastureId,
        uint256 forageQuality
    );

    constructor() Ownable(msg.sender) {}

    function assessQuality(
        string memory pastureId,
        uint256 forageQuality,
        uint256 carryingCapacity,
        string memory condition,
        string memory recommendations
    ) public returns (uint256) {
        uint256 qualityId = _qualityIdCounter++;
        qualities[qualityId] = PastureQuality({
            qualityId: qualityId,
            farmer: msg.sender,
            pastureId: pastureId,
            forageQuality: forageQuality,
            carryingCapacity: carryingCapacity,
            assessmentDate: block.timestamp,
            condition: condition,
            recommendations: recommendations
        });

        qualitiesByFarmer[msg.sender].push(qualityId);
        emit QualityAssessed(qualityId, msg.sender, pastureId, forageQuality);
        return qualityId;
    }

    function getQuality(uint256 qualityId) public view returns (PastureQuality memory) {
        return qualities[qualityId];
    }
}

