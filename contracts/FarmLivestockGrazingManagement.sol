// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockGrazingManagement
 * @dev Onchain system for managing livestock grazing schedules and pasture rotation
 */
contract FarmLivestockGrazingManagement is Ownable {
    struct GrazingRecord {
        uint256 recordId;
        uint256 livestockGroupId;
        uint256 pastureId;
        uint256 startDate;
        uint256 endDate;
        uint256 grazingDuration;
        address manager;
    }

    mapping(uint256 => GrazingRecord) public grazingRecords;
    mapping(address => uint256[]) public recordsByManager;
    uint256 private _recordIdCounter;

    event GrazingRecorded(
        uint256 indexed recordId,
        address indexed manager,
        uint256 pastureId
    );

    constructor() Ownable(msg.sender) {}

    function recordGrazing(
        uint256 livestockGroupId,
        uint256 pastureId,
        uint256 startDate,
        uint256 endDate
    ) public returns (uint256) {
        require(endDate > startDate, "Invalid dates");
        uint256 grazingDuration = endDate - startDate;
        
        uint256 recordId = _recordIdCounter++;
        grazingRecords[recordId] = GrazingRecord({
            recordId: recordId,
            livestockGroupId: livestockGroupId,
            pastureId: pastureId,
            startDate: startDate,
            endDate: endDate,
            grazingDuration: grazingDuration,
            manager: msg.sender
        });

        recordsByManager[msg.sender].push(recordId);

        emit GrazingRecorded(recordId, msg.sender, pastureId);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (GrazingRecord memory) {
        return grazingRecords[recordId];
    }
}

