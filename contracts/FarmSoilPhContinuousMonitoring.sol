// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilPhContinuousMonitoring
 * @dev Onchain continuous soil pH monitoring and alerts
 */
contract FarmSoilPhContinuousMonitoring is Ownable {
    struct PhRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        uint256 phLevel;
        uint256 recordDate;
        string alertLevel;
        bool requiresAction;
    }

    mapping(uint256 => PhRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event PhRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        uint256 phLevel,
        string alertLevel
    );

    constructor() Ownable(msg.sender) {}

    function recordPh(
        string memory fieldId,
        uint256 phLevel
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        string memory alertLevel = "Normal";
        bool requiresAction = false;

        if (phLevel < 5 || phLevel > 8) {
            alertLevel = "Critical";
            requiresAction = true;
        } else if (phLevel < 6 || phLevel > 7.5) {
            alertLevel = "Warning";
            requiresAction = true;
        }

        records[recordId] = PhRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            phLevel: phLevel,
            recordDate: block.timestamp,
            alertLevel: alertLevel,
            requiresAction: requiresAction
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit PhRecorded(recordId, msg.sender, fieldId, phLevel, alertLevel);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (PhRecord memory) {
        return records[recordId];
    }
}

