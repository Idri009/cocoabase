// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockQuarantine
 * @dev Onchain system for tracking livestock quarantine periods
 */
contract FarmLivestockQuarantine is Ownable {
    struct QuarantineRecord {
        uint256 recordId;
        uint256 livestockId;
        uint256 startDate;
        uint256 endDate;
        string reason;
        address recorder;
        bool released;
    }

    mapping(uint256 => QuarantineRecord) public quarantineRecords;
    mapping(address => uint256[]) public recordsByRecorder;
    uint256 private _recordIdCounter;

    event QuarantineStarted(
        uint256 indexed recordId,
        address indexed recorder,
        uint256 livestockId
    );

    event QuarantineReleased(uint256 indexed recordId);

    constructor() Ownable(msg.sender) {}

    function startQuarantine(
        uint256 livestockId,
        uint256 duration,
        string memory reason
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        quarantineRecords[recordId] = QuarantineRecord({
            recordId: recordId,
            livestockId: livestockId,
            startDate: block.timestamp,
            endDate: block.timestamp + duration,
            reason: reason,
            recorder: msg.sender,
            released: false
        });

        recordsByRecorder[msg.sender].push(recordId);

        emit QuarantineStarted(recordId, msg.sender, livestockId);
        return recordId;
    }

    function releaseQuarantine(uint256 recordId) public {
        require(quarantineRecords[recordId].recorder == msg.sender, "Not the recorder");
        require(block.timestamp >= quarantineRecords[recordId].endDate, "Quarantine not ended");
        quarantineRecords[recordId].released = true;
        emit QuarantineReleased(recordId);
    }

    function getRecord(uint256 recordId) public view returns (QuarantineRecord memory) {
        return quarantineRecords[recordId];
    }
}


