// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmFertilizerApplication
 * @dev Onchain system for tracking fertilizer applications
 */
contract FarmFertilizerApplication is Ownable {
    struct Application {
        uint256 applicationId;
        uint256 plantationId;
        string fertilizerType;
        uint256 amount;
        uint256 applicationDate;
        address applicator;
        bool organic;
    }

    mapping(uint256 => Application) public applications;
    mapping(address => uint256[]) public applicationsByApplicator;
    uint256 private _applicationIdCounter;

    event FertilizerApplied(
        uint256 indexed applicationId,
        address indexed applicator,
        string fertilizerType
    );

    constructor() Ownable(msg.sender) {}

    function recordApplication(
        uint256 plantationId,
        string memory fertilizerType,
        uint256 amount,
        bool organic
    ) public returns (uint256) {
        uint256 applicationId = _applicationIdCounter++;
        applications[applicationId] = Application({
            applicationId: applicationId,
            plantationId: plantationId,
            fertilizerType: fertilizerType,
            amount: amount,
            applicationDate: block.timestamp,
            applicator: msg.sender,
            organic: organic
        });

        applicationsByApplicator[msg.sender].push(applicationId);

        emit FertilizerApplied(applicationId, msg.sender, fertilizerType);
        return applicationId;
    }

    function getApplication(uint256 applicationId) public view returns (Application memory) {
        return applications[applicationId];
    }
}



