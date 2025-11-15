// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockHealthRecords
 * @dev Onchain comprehensive health records for livestock
 */
contract FarmLivestockHealthRecords is Ownable {
    struct HealthRecord {
        uint256 recordId;
        address farmer;
        string livestockId;
        string condition;
        string treatment;
        uint256 recordDate;
        address veterinarian;
    }

    mapping(uint256 => HealthRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    mapping(string => uint256[]) public recordsByLivestock;
    uint256 private _recordIdCounter;

    event HealthRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string livestockId,
        string condition
    );

    constructor() Ownable(msg.sender) {}

    function recordHealth(
        string memory livestockId,
        string memory condition,
        string memory treatment,
        address veterinarian
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = HealthRecord({
            recordId: recordId,
            farmer: msg.sender,
            livestockId: livestockId,
            condition: condition,
            treatment: treatment,
            recordDate: block.timestamp,
            veterinarian: veterinarian
        });

        recordsByFarmer[msg.sender].push(recordId);
        recordsByLivestock[livestockId].push(recordId);

        emit HealthRecorded(recordId, msg.sender, livestockId, condition);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (HealthRecord memory) {
        return records[recordId];
    }
}

