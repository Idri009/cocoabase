// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilMicrobialActivity
 * @dev Onchain soil microbial activity and health indicators tracking
 */
contract FarmSoilMicrobialActivity is Ownable {
    struct MicrobialRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        uint256 microbialCount;
        uint256 diversityIndex;
        uint256 activityLevel;
        uint256 recordDate;
        string healthIndicator;
    }

    mapping(uint256 => MicrobialRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event ActivityRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        uint256 activityLevel
    );

    constructor() Ownable(msg.sender) {}

    function recordActivity(
        string memory fieldId,
        uint256 microbialCount,
        uint256 diversityIndex,
        uint256 activityLevel,
        string memory healthIndicator
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = MicrobialRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            microbialCount: microbialCount,
            diversityIndex: diversityIndex,
            activityLevel: activityLevel,
            recordDate: block.timestamp,
            healthIndicator: healthIndicator
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit ActivityRecorded(recordId, msg.sender, fieldId, activityLevel);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (MicrobialRecord memory) {
        return records[recordId];
    }
}
