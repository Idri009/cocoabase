// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSmartIrrigation
 * @dev AI-powered smart irrigation system with automated scheduling and optimization
 */
contract FarmSmartIrrigation is Ownable {
    struct IrrigationSchedule {
        uint256 scheduleId;
        address farmer;
        string fieldId;
        uint256 waterAmount;
        uint256 irrigationTime;
        uint256 nextIrrigation;
        bool automated;
        uint256 efficiencyScore;
    }

    mapping(uint256 => IrrigationSchedule) public schedules;
    mapping(address => uint256[]) public schedulesByFarmer;
    uint256 private _scheduleIdCounter;

    event ScheduleCreated(
        uint256 indexed scheduleId,
        address indexed farmer,
        string fieldId
    );

    event IrrigationExecuted(
        uint256 indexed scheduleId,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    function createSchedule(
        string memory fieldId,
        uint256 waterAmount,
        uint256 irrigationTime,
        uint256 nextIrrigation,
        bool automated
    ) public returns (uint256) {
        uint256 scheduleId = _scheduleIdCounter++;
        schedules[scheduleId] = IrrigationSchedule({
            scheduleId: scheduleId,
            farmer: msg.sender,
            fieldId: fieldId,
            waterAmount: waterAmount,
            irrigationTime: irrigationTime,
            nextIrrigation: nextIrrigation,
            automated: automated,
            efficiencyScore: 0
        });

        schedulesByFarmer[msg.sender].push(scheduleId);
        emit ScheduleCreated(scheduleId, msg.sender, fieldId);
        return scheduleId;
    }

    function executeIrrigation(uint256 scheduleId) public {
        require(schedules[scheduleId].farmer == msg.sender, "Not authorized");
        emit IrrigationExecuted(scheduleId, block.timestamp);
    }

    function updateEfficiencyScore(uint256 scheduleId, uint256 score) public onlyOwner {
        schedules[scheduleId].efficiencyScore = score;
    }

    function getSchedule(uint256 scheduleId) public view returns (IrrigationSchedule memory) {
        return schedules[scheduleId];
    }
}
