// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmHarvestScheduling
 * @dev Onchain system for scheduling and tracking harvest operations
 */
contract FarmHarvestScheduling is Ownable {
    struct HarvestSchedule {
        uint256 scheduleId;
        uint256 plantationId;
        uint256 scheduledDate;
        uint256 expectedYield;
        address scheduler;
        bool completed;
        uint256 actualYield;
    }

    mapping(uint256 => HarvestSchedule) public harvestSchedules;
    mapping(address => uint256[]) public schedulesByScheduler;
    uint256 private _scheduleIdCounter;

    event HarvestScheduled(
        uint256 indexed scheduleId,
        address indexed scheduler,
        uint256 scheduledDate
    );

    event HarvestCompleted(
        uint256 indexed scheduleId,
        uint256 actualYield
    );

    constructor() Ownable(msg.sender) {}

    function scheduleHarvest(
        uint256 plantationId,
        uint256 scheduledDate,
        uint256 expectedYield
    ) public returns (uint256) {
        uint256 scheduleId = _scheduleIdCounter++;
        harvestSchedules[scheduleId] = HarvestSchedule({
            scheduleId: scheduleId,
            plantationId: plantationId,
            scheduledDate: scheduledDate,
            expectedYield: expectedYield,
            scheduler: msg.sender,
            completed: false,
            actualYield: 0
        });

        schedulesByScheduler[msg.sender].push(scheduleId);

        emit HarvestScheduled(scheduleId, msg.sender, scheduledDate);
        return scheduleId;
    }

    function completeHarvest(uint256 scheduleId, uint256 actualYield) public {
        require(harvestSchedules[scheduleId].scheduler == msg.sender, "Not the scheduler");
        require(!harvestSchedules[scheduleId].completed, "Already completed");
        
        harvestSchedules[scheduleId].completed = true;
        harvestSchedules[scheduleId].actualYield = actualYield;
        
        emit HarvestCompleted(scheduleId, actualYield);
    }

    function getSchedule(uint256 scheduleId) public view returns (HarvestSchedule memory) {
        return harvestSchedules[scheduleId];
    }
}


