// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmPesticideTracking
 * @dev Comprehensive pesticide usage tracking and compliance monitoring
 */
contract FarmPesticideTracking is Ownable {
    struct PesticideApplication {
        uint256 applicationId;
        address farmer;
        string pesticideType;
        uint256 quantity;
        string fieldId;
        uint256 applicationDate;
        string safetyData;
        bool approved;
    }

    mapping(uint256 => PesticideApplication) public applications;
    mapping(address => uint256[]) public applicationsByFarmer;
    uint256 private _applicationIdCounter;

    event ApplicationRecorded(
        uint256 indexed applicationId,
        address indexed farmer,
        string pesticideType
    );

    constructor() Ownable(msg.sender) {}

    function recordApplication(
        string memory pesticideType,
        uint256 quantity,
        string memory fieldId,
        string memory safetyData
    ) public returns (uint256) {
        uint256 applicationId = _applicationIdCounter++;
        applications[applicationId] = PesticideApplication({
            applicationId: applicationId,
            farmer: msg.sender,
            pesticideType: pesticideType,
            quantity: quantity,
            fieldId: fieldId,
            applicationDate: block.timestamp,
            safetyData: safetyData,
            approved: false
        });

        applicationsByFarmer[msg.sender].push(applicationId);
        emit ApplicationRecorded(applicationId, msg.sender, pesticideType);
        return applicationId;
    }

    function approveApplication(uint256 applicationId) public onlyOwner {
        applications[applicationId].approved = true;
    }

    function getApplication(uint256 applicationId) public view returns (PesticideApplication memory) {
        return applications[applicationId];
    }
}
