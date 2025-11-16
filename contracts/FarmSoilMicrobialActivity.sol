// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilMicrobialActivity
 * @dev Track soil microbial activity and health indicators
 */
contract FarmSoilMicrobialActivity is Ownable {
    struct MicrobialActivity {
        uint256 recordId;
        address farmer;
        string fieldId;
        uint256 activityLevel;
        uint256 diversityIndex;
        uint256 recordDate;
    }

    mapping(uint256 => MicrobialActivity) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event ActivityRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        uint256 activityLevel
    );

    constructor() Ownable(msg.sender) {}

    function recordActivity(
        string memory fieldId,
        uint256 activityLevel,
        uint256 diversityIndex
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = MicrobialActivity({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            activityLevel: activityLevel,
            diversityIndex: diversityIndex,
            recordDate: block.timestamp
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit ActivityRecorded(recordId, msg.sender, activityLevel);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (MicrobialActivity memory) {
        return records[recordId];
    }
}
