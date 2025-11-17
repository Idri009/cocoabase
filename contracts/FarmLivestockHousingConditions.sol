// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockHousingConditions
 * @dev Onchain housing conditions monitoring and welfare compliance
 */
contract FarmLivestockHousingConditions is Ownable {
    struct ConditionRecord {
        uint256 recordId;
        address farmer;
        string housingId;
        uint256 temperature;
        uint256 humidity;
        uint256 ventilation;
        uint256 recordDate;
        string complianceStatus;
    }

    mapping(uint256 => ConditionRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event ConditionRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string housingId,
        string complianceStatus
    );

    constructor() Ownable(msg.sender) {}

    function recordConditions(
        string memory housingId,
        uint256 temperature,
        uint256 humidity,
        uint256 ventilation
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        string memory complianceStatus = "Compliant";
        if (temperature > 30 || temperature < 10 || humidity > 80 || ventilation < 50) {
            complianceStatus = "Non-Compliant";
        }

        records[recordId] = ConditionRecord({
            recordId: recordId,
            farmer: msg.sender,
            housingId: housingId,
            temperature: temperature,
            humidity: humidity,
            ventilation: ventilation,
            recordDate: block.timestamp,
            complianceStatus: complianceStatus
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit ConditionRecorded(recordId, msg.sender, housingId, complianceStatus);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (ConditionRecord memory) {
        return records[recordId];
    }
}
