// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLaborScheduling
 * @dev Onchain system for scheduling labor tasks
 */
contract FarmLaborScheduling is Ownable {
    struct LaborSchedule {
        uint256 scheduleId;
        address worker;
        uint256 plantationId;
        string task;
        uint256 scheduledDate;
        uint256 hours;
        address scheduler;
        bool completed;
    }

    mapping(uint256 => LaborSchedule) public laborSchedules;
    mapping(address => uint256[]) public schedulesByScheduler;
    uint256 private _scheduleIdCounter;

    event LaborScheduled(
        uint256 indexed scheduleId,
        address indexed scheduler,
        address worker
    );

    event LaborCompleted(uint256 indexed scheduleId);

    constructor() Ownable(msg.sender) {}

    function scheduleLabor(
        address worker,
        uint256 plantationId,
        string memory task,
        uint256 scheduledDate,
        uint256 hours
    ) public returns (uint256) {
        uint256 scheduleId = _scheduleIdCounter++;
        laborSchedules[scheduleId] = LaborSchedule({
            scheduleId: scheduleId,
            worker: worker,
            plantationId: plantationId,
            task: task,
            scheduledDate: scheduledDate,
            hours: hours,
            scheduler: msg.sender,
            completed: false
        });

        schedulesByScheduler[msg.sender].push(scheduleId);

        emit LaborScheduled(scheduleId, msg.sender, worker);
        return scheduleId;
    }

    function completeLabor(uint256 scheduleId) public {
        require(laborSchedules[scheduleId].scheduler == msg.sender, "Not the scheduler");
        laborSchedules[scheduleId].completed = true;
        emit LaborCompleted(scheduleId);
    }

    function getSchedule(uint256 scheduleId) public view returns (LaborSchedule memory) {
        return laborSchedules[scheduleId];
    }
}


