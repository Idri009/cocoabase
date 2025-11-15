// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropWeedingSchedule
 * @dev Onchain weeding schedule and weed management tracking
 */
contract FarmCropWeedingSchedule is Ownable {
    struct WeedingSchedule {
        uint256 scheduleId;
        address farmer;
        string fieldId;
        uint256 scheduledDate;
        uint256 completedDate;
        string weedingMethod;
        bool isCompleted;
    }

    mapping(uint256 => WeedingSchedule) public schedules;
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
        uint256 scheduledDate,
        string memory weedingMethod
    ) public returns (uint256) {
        uint256 scheduleId = _scheduleIdCounter++;
        schedules[scheduleId] = WeedingSchedule({
            scheduleId: scheduleId,
            farmer: msg.sender,
            fieldId: fieldId,
            scheduledDate: scheduledDate,
            completedDate: 0,
            weedingMethod: weedingMethod,
            isCompleted: false
        });

        schedulesByFarmer[msg.sender].push(scheduleId);
        emit ScheduleCreated(scheduleId, msg.sender, fieldId);
        return scheduleId;
    }

    function completeWeeding(uint256 scheduleId) public {
        require(schedules[scheduleId].farmer == msg.sender, "Not schedule owner");
        schedules[scheduleId].completedDate = block.timestamp;
        schedules[scheduleId].isCompleted = true;
    }

    function getSchedule(uint256 scheduleId) public view returns (WeedingSchedule memory) {
        return schedules[scheduleId];
    }
}

