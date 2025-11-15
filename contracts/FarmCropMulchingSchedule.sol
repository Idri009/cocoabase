// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropMulchingSchedule
 * @dev Onchain mulching schedule and material tracking
 */
contract FarmCropMulchingSchedule is Ownable {
    struct MulchingSchedule {
        uint256 scheduleId;
        address farmer;
        string fieldId;
        string mulchType;
        uint256 quantity;
        uint256 scheduledDate;
        uint256 appliedDate;
        bool isApplied;
    }

    mapping(uint256 => MulchingSchedule) public schedules;
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
        string memory mulchType,
        uint256 quantity,
        uint256 scheduledDate
    ) public returns (uint256) {
        uint256 scheduleId = _scheduleIdCounter++;
        schedules[scheduleId] = MulchingSchedule({
            scheduleId: scheduleId,
            farmer: msg.sender,
            fieldId: fieldId,
            mulchType: mulchType,
            quantity: quantity,
            scheduledDate: scheduledDate,
            appliedDate: 0,
            isApplied: false
        });

        schedulesByFarmer[msg.sender].push(scheduleId);
        emit ScheduleCreated(scheduleId, msg.sender, fieldId);
        return scheduleId;
    }

    function recordApplication(uint256 scheduleId) public {
        require(schedules[scheduleId].farmer == msg.sender, "Not schedule owner");
        schedules[scheduleId].appliedDate = block.timestamp;
        schedules[scheduleId].isApplied = true;
    }

    function getSchedule(uint256 scheduleId) public view returns (MulchingSchedule memory) {
        return schedules[scheduleId];
    }
}

