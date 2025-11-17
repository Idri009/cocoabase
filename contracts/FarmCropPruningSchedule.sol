// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropPruningSchedule
 * @dev Onchain pruning schedule and maintenance tracking
 */
contract FarmCropPruningSchedule is Ownable {
    struct PruningRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        uint256 scheduledDate;
        uint256 actualDate;
        string pruningType;
        bool isCompleted;
    }

    mapping(uint256 => PruningRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event PruningScheduled(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        uint256 scheduledDate
    );

    constructor() Ownable(msg.sender) {}

    function schedulePruning(
        string memory fieldId,
        uint256 scheduledDate,
        string memory pruningType
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = PruningRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            scheduledDate: scheduledDate,
            actualDate: 0,
            pruningType: pruningType,
            isCompleted: false
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit PruningScheduled(recordId, msg.sender, fieldId, scheduledDate);
        return recordId;
    }

    function completePruning(uint256 recordId) public {
        require(records[recordId].farmer == msg.sender, "Not record owner");
        records[recordId].actualDate = block.timestamp;
        records[recordId].isCompleted = true;
    }

    function getRecord(uint256 recordId) public view returns (PruningRecord memory) {
        return records[recordId];
    }
}
