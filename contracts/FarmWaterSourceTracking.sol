// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWaterSourceTracking
 * @dev Onchain water sources and usage patterns tracking
 */
contract FarmWaterSourceTracking is Ownable {
    struct SourceRecord {
        uint256 recordId;
        address farmer;
        string sourceId;
        string sourceType;
        uint256 volumeUsed;
        uint256 recordDate;
        string usagePattern;
        string location;
    }

    mapping(uint256 => SourceRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    mapping(string => uint256[]) public recordsBySource;
    uint256 private _recordIdCounter;

    event SourceRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string sourceId,
        uint256 volumeUsed
    );

    constructor() Ownable(msg.sender) {}

    function recordSource(
        string memory sourceId,
        string memory sourceType,
        uint256 volumeUsed,
        string memory usagePattern,
        string memory location
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = SourceRecord({
            recordId: recordId,
            farmer: msg.sender,
            sourceId: sourceId,
            sourceType: sourceType,
            volumeUsed: volumeUsed,
            recordDate: block.timestamp,
            usagePattern: usagePattern,
            location: location
        });

        recordsByFarmer[msg.sender].push(recordId);
        recordsBySource[sourceId].push(recordId);
        emit SourceRecorded(recordId, msg.sender, sourceId, volumeUsed);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (SourceRecord memory) {
        return records[recordId];
    }
}
