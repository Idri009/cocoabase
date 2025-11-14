// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmIrrigationManagement
 * @dev Onchain system for managing irrigation schedules and water usage
 */
contract FarmIrrigationManagement is Ownable {
    struct IrrigationSchedule {
        uint256 scheduleId;
        uint256 plantationId;
        uint256 waterAmount;
        uint256 frequency;
        uint256 nextIrrigation;
        address manager;
        bool active;
    }

    mapping(uint256 => IrrigationSchedule) public schedules;
    mapping(address => uint256[]) public schedulesByManager;
    uint256 private _scheduleIdCounter;

    event IrrigationScheduled(
        uint256 indexed scheduleId,
        address indexed manager,
        uint256 waterAmount
    );

    event IrrigationCompleted(uint256 indexed scheduleId, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    function createSchedule(
        uint256 plantationId,
        uint256 waterAmount,
        uint256 frequency
    ) public returns (uint256) {
        uint256 scheduleId = _scheduleIdCounter++;
        schedules[scheduleId] = IrrigationSchedule({
            scheduleId: scheduleId,
            plantationId: plantationId,
            waterAmount: waterAmount,
            frequency: frequency,
            nextIrrigation: block.timestamp + frequency,
            manager: msg.sender,
            active: true
        });

        schedulesByManager[msg.sender].push(scheduleId);

        emit IrrigationScheduled(scheduleId, msg.sender, waterAmount);
        return scheduleId;
    }

    function completeIrrigation(uint256 scheduleId) public {
        require(schedules[scheduleId].manager == msg.sender, "Not the manager");
        require(schedules[scheduleId].active, "Schedule not active");
        
        schedules[scheduleId].nextIrrigation = block.timestamp + schedules[scheduleId].frequency;
        emit IrrigationCompleted(scheduleId, block.timestamp);
    }

    function getSchedule(uint256 scheduleId) public view returns (IrrigationSchedule memory) {
        return schedules[scheduleId];
    }
}
