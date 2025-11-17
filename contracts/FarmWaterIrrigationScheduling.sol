// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWaterIrrigationScheduling
 * @dev Advanced irrigation scheduling and automation
 */
contract FarmWaterIrrigationScheduling is Ownable {
    struct IrrigationSchedule {
        uint256 scheduleId;
        address farmer;
        string fieldId;
        uint256 startTime;
        uint256 duration;
        uint256 waterAmount;
        bool completed;
    }

    mapping(uint256 => IrrigationSchedule) public schedules;
    uint256 private _scheduleIdCounter;

    event ScheduleCreated(
        uint256 indexed scheduleId,
        address indexed farmer,
        uint256 startTime
    );

    constructor() Ownable(msg.sender) {}

    function createSchedule(
        string memory fieldId,
        uint256 startTime,
        uint256 duration,
        uint256 waterAmount
    ) public returns (uint256) {
        uint256 scheduleId = _scheduleIdCounter++;
        schedules[scheduleId] = IrrigationSchedule({
            scheduleId: scheduleId,
            farmer: msg.sender,
            fieldId: fieldId,
            startTime: startTime,
            duration: duration,
            waterAmount: waterAmount,
            completed: false
        });

        emit ScheduleCreated(scheduleId, msg.sender, startTime);
        return scheduleId;
    }

    function completeSchedule(uint256 scheduleId) public {
        require(schedules[scheduleId].farmer == msg.sender, "Not authorized");
        schedules[scheduleId].completed = true;
    }

    function getSchedule(uint256 scheduleId) public view returns (IrrigationSchedule memory) {
        return schedules[scheduleId];
    }
}
