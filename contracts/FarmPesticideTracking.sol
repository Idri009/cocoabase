// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmPesticideTracking
 * @dev Pesticide usage tracking system
 */
contract FarmPesticideTracking is Ownable {
    struct PesticideApplication {
        uint256 applicationId;
        address farmer;
        uint256 fieldId;
        string pesticideName;
        uint256 quantity;
        uint256 applicationDate;
        string method;
    }

    mapping(uint256 => PesticideApplication) public applications;
    mapping(address => uint256[]) public applicationsByFarmer;
    mapping(uint256 => uint256[]) public applicationsByField;
    mapping(uint256 => uint256) public totalUsageByField;
    uint256 private _applicationIdCounter;

    event ApplicationRecorded(
        uint256 indexed applicationId,
        address indexed farmer,
        string pesticideName
    );

    constructor() Ownable(msg.sender) {}

    function recordApplication(
        uint256 fieldId,
        string memory pesticideName,
        uint256 quantity,
        string memory method
    ) public returns (uint256) {
        require(quantity > 0, "Invalid quantity");
        uint256 applicationId = _applicationIdCounter++;
        applications[applicationId] = PesticideApplication({
            applicationId: applicationId,
            farmer: msg.sender,
            fieldId: fieldId,
            pesticideName: pesticideName,
            quantity: quantity,
            applicationDate: block.timestamp,
            method: method
        });
        applicationsByFarmer[msg.sender].push(applicationId);
        applicationsByField[fieldId].push(applicationId);
        totalUsageByField[fieldId] += quantity;
        emit ApplicationRecorded(applicationId, msg.sender, pesticideName);
        return applicationId;
    }

    function getTotalUsage(uint256 fieldId) public view returns (uint256) {
        return totalUsageByField[fieldId];
    }
}
