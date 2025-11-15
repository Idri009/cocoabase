// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilCompactionMonitoring
 * @dev Monitor soil compaction levels
 */
contract FarmSoilCompactionMonitoring is Ownable {
    struct CompactionReading {
        uint256 readingId;
        uint256 fieldId;
        uint256 compactionLevel;
        uint256 depth;
        uint256 recordedDate;
        address recorder;
    }

    mapping(uint256 => CompactionReading) public readings;
    mapping(address => uint256[]) public readingsByOwner;
    uint256 private _readingIdCounter;

    event CompactionRecorded(
        uint256 indexed readingId,
        address indexed owner,
        uint256 fieldId,
        uint256 compactionLevel
    );

    constructor() Ownable(msg.sender) {}

    function recordCompaction(
        uint256 fieldId,
        uint256 compactionLevel,
        uint256 depth
    ) public returns (uint256) {
        uint256 readingId = _readingIdCounter++;
        readings[readingId] = CompactionReading({
            readingId: readingId,
            fieldId: fieldId,
            compactionLevel: compactionLevel,
            depth: depth,
            recordedDate: block.timestamp,
            recorder: msg.sender
        });

        readingsByOwner[msg.sender].push(readingId);

        emit CompactionRecorded(readingId, msg.sender, fieldId, compactionLevel);
        return readingId;
    }

    function getReading(uint256 readingId) public view returns (CompactionReading memory) {
        return readings[readingId];
    }

    function getReadingsByOwner(address owner) public view returns (uint256[] memory) {
        return readingsByOwner[owner];
    }
}


