// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropFertilizerApplicationTracking
 * @dev Onchain fertilizer application tracking and optimization
 */
contract FarmCropFertilizerApplicationTracking is Ownable {
    struct ApplicationRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        string fertilizerType;
        uint256 quantity;
        uint256 applicationDate;
        string method;
    }

    mapping(uint256 => ApplicationRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event ApplicationRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        string fertilizerType
    );

    constructor() Ownable(msg.sender) {}

    function recordApplication(
        string memory fieldId,
        string memory fertilizerType,
        uint256 quantity,
        string memory method
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = ApplicationRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            fertilizerType: fertilizerType,
            quantity: quantity,
            applicationDate: block.timestamp,
            method: method
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit ApplicationRecorded(recordId, msg.sender, fieldId, fertilizerType);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (ApplicationRecord memory) {
        return records[recordId];
    }
}

