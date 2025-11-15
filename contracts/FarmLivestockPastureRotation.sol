// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockPastureRotation
 * @dev Onchain system for managing pasture rotation schedules
 */
contract FarmLivestockPastureRotation is Ownable {
    struct RotationSchedule {
        uint256 scheduleId;
        uint256 pastureId;
        uint256 rotationStartDate;
        uint256 rotationEndDate;
        uint256 restPeriod;
        string rotationReason;
        address planner;
    }

    mapping(uint256 => RotationSchedule) public rotationSchedules;
    mapping(address => uint256[]) public schedulesByPlanner;
    uint256 private _scheduleIdCounter;

    event RotationScheduled(
        uint256 indexed scheduleId,
        address indexed planner,
        uint256 pastureId
    );

    constructor() Ownable(msg.sender) {}

    function scheduleRotation(
        uint256 pastureId,
        uint256 rotationStartDate,
        uint256 rotationEndDate,
        uint256 restPeriod,
        string memory rotationReason
    ) public returns (uint256) {
        require(rotationEndDate > rotationStartDate, "Invalid dates");
        uint256 scheduleId = _scheduleIdCounter++;
        rotationSchedules[scheduleId] = RotationSchedule({
            scheduleId: scheduleId,
            pastureId: pastureId,
            rotationStartDate: rotationStartDate,
            rotationEndDate: rotationEndDate,
            restPeriod: restPeriod,
            rotationReason: rotationReason,
            planner: msg.sender
        });

        schedulesByPlanner[msg.sender].push(scheduleId);

        emit RotationScheduled(scheduleId, msg.sender, pastureId);
        return scheduleId;
    }

    function getSchedule(uint256 scheduleId) public view returns (RotationSchedule memory) {
        return rotationSchedules[scheduleId];
    }
}

