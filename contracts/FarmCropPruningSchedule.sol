// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropPruningSchedule
 * @dev Onchain pruning schedule and maintenance tracking
 */
contract FarmCropPruningSchedule is Ownable {
    struct PruningSchedule {
        uint256 scheduleId;
        address farmer;
        string fieldId;
        string cropType;
        uint256 scheduledDate;
        uint256 completedDate;
        string pruningType;
        bool isCompleted;
    }

    mapping(uint256 => PruningSchedule) public schedules;
    mapping(address => uint256[]) public schedulesByFarmer;
    uint256 private _scheduleIdCounter;

    event ScheduleCreated(
        uint256 indexed scheduleId,
        address indexed farmer,
        string fieldId
    );

    constructor() Ownable(msg.sender) {}

    function createSchedule(
        string memory fieldId,
        string memory cropType,
        uint256 scheduledDate,
        string memory pruningType
    ) public returns (uint256) {
        uint256 scheduleId = _scheduleIdCounter++;
        schedules[scheduleId] = PruningSchedule({
            scheduleId: scheduleId,
            farmer: msg.sender,
            fieldId: fieldId,
            cropType: cropType,
            scheduledDate: scheduledDate,
            completedDate: 0,
            pruningType: pruningType,
            isCompleted: false
        });

        schedulesByFarmer[msg.sender].push(scheduleId);
        emit ScheduleCreated(scheduleId, msg.sender, fieldId);
        return scheduleId;
    }

    function completePruning(uint256 scheduleId) public {
        require(schedules[scheduleId].farmer == msg.sender, "Not schedule owner");
        schedules[scheduleId].completedDate = block.timestamp;
        schedules[scheduleId].isCompleted = true;
    }

    function getSchedule(uint256 scheduleId) public view returns (PruningSchedule memory) {
        return schedules[scheduleId];
    }
}

