// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilAmendmentsTracking
 * @dev Onchain soil amendment application tracking and impact measurement
 */
contract FarmSoilAmendmentsTracking is Ownable {
    struct AmendmentRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        string amendmentType;
        uint256 amount;
        uint256 applicationDate;
        uint256 impactScore;
        string impactMeasurement;
    }

    mapping(uint256 => AmendmentRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event AmendmentRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        string amendmentType
    );

    constructor() Ownable(msg.sender) {}

    function recordAmendment(
        string memory fieldId,
        string memory amendmentType,
        uint256 amount,
        uint256 impactScore,
        string memory impactMeasurement
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = AmendmentRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            amendmentType: amendmentType,
            amount: amount,
            applicationDate: block.timestamp,
            impactScore: impactScore,
            impactMeasurement: impactMeasurement
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit AmendmentRecorded(recordId, msg.sender, fieldId, amendmentType);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (AmendmentRecord memory) {
        return records[recordId];
    }
}

