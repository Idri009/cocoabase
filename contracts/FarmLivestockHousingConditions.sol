// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockHousingConditions
 * @dev Onchain housing conditions monitoring and welfare compliance
 */
contract FarmLivestockHousingConditions is Ownable {
    struct HousingRecord {
        uint256 recordId;
        address farmer;
        string facilityId;
        uint256 temperature;
        uint256 humidity;
        uint256 ventilation;
        uint256 recordDate;
        string complianceStatus;
    }

    mapping(uint256 => HousingRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event ConditionRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string facilityId
    );

    constructor() Ownable(msg.sender) {}

    function recordConditions(
        string memory facilityId,
        uint256 temperature,
        uint256 humidity,
        uint256 ventilation,
        string memory complianceStatus
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = HousingRecord({
            recordId: recordId,
            farmer: msg.sender,
            facilityId: facilityId,
            temperature: temperature,
            humidity: humidity,
            ventilation: ventilation,
            recordDate: block.timestamp,
            complianceStatus: complianceStatus
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit ConditionRecorded(recordId, msg.sender, facilityId);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (HousingRecord memory) {
        return records[recordId];
    }
}

