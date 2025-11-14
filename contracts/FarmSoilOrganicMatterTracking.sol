// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilOrganicMatterTracking
 * @dev Track soil organic matter levels
 */
contract FarmSoilOrganicMatterTracking is Ownable {
    struct OrganicMatterReading {
        uint256 readingId;
        uint256 fieldId;
        uint256 organicMatterPercentage;
        uint256 depth;
        uint256 recordedDate;
        address recorder;
    }

    mapping(uint256 => OrganicMatterReading) public readings;
    mapping(address => uint256[]) public readingsByOwner;
    uint256 private _readingIdCounter;

    event ReadingRecorded(
        uint256 indexed readingId,
        address indexed owner,
        uint256 fieldId,
        uint256 organicMatterPercentage
    );

    constructor() Ownable(msg.sender) {}

    function recordReading(
        uint256 fieldId,
        uint256 organicMatterPercentage,
        uint256 depth
    ) public returns (uint256) {
        uint256 readingId = _readingIdCounter++;
        readings[readingId] = OrganicMatterReading({
            readingId: readingId,
            fieldId: fieldId,
            organicMatterPercentage: organicMatterPercentage,
            depth: depth,
            recordedDate: block.timestamp,
            recorder: msg.sender
        });

        readingsByOwner[msg.sender].push(readingId);

        emit ReadingRecorded(readingId, msg.sender, fieldId, organicMatterPercentage);
        return readingId;
    }

    function getReading(uint256 readingId) public view returns (OrganicMatterReading memory) {
        return readings[readingId];
    }

    function getReadingsByOwner(address owner) public view returns (uint256[] memory) {
        return readingsByOwner[owner];
    }
}

