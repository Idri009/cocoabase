// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockGrazingIntensity
 * @dev Grazing intensity management and optimization
 */
contract FarmLivestockGrazingIntensity is Ownable {
    struct IntensityRecord {
        uint256 recordId;
        address farmer;
        string pastureId;
        uint256 livestockDensity;
        uint256 grazingDuration;
        uint256 recordDate;
        bool optimal;
    }

    mapping(uint256 => IntensityRecord) public records;
    uint256 private _recordIdCounter;

    event RecordCreated(
        uint256 indexed recordId,
        address indexed farmer,
        uint256 livestockDensity
    );

    constructor() Ownable(msg.sender) {}

    function recordIntensity(
        string memory pastureId,
        uint256 livestockDensity,
        uint256 grazingDuration
    ) public returns (uint256) {
        bool optimal = livestockDensity >= 10 && livestockDensity <= 30 && grazingDuration <= 48;
        uint256 recordId = _recordIdCounter++;
        records[recordId] = IntensityRecord({
            recordId: recordId,
            farmer: msg.sender,
            pastureId: pastureId,
            livestockDensity: livestockDensity,
            grazingDuration: grazingDuration,
            recordDate: block.timestamp,
            optimal: optimal
        });

        emit RecordCreated(recordId, msg.sender, livestockDensity);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (IntensityRecord memory) {
        return records[recordId];
    }
}
