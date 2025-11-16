// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropThinningSchedule
 * @dev Onchain crop thinning schedule and spacing optimization
 */
contract FarmCropThinningSchedule is Ownable {
    struct ThinningSchedule {
        uint256 scheduleId;
        address farmer;
        string fieldId;
        uint256 scheduledDate;
        uint256 completedDate;
        uint256 plantsRemoved;
        string spacing;
        bool isCompleted;
    }

    mapping(uint256 => ThinningSchedule) public schedules;
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
        uint256 plantsRemoved,
        string memory spacing
    ) public returns (uint256) {
        uint256 scheduleId = _scheduleIdCounter++;
        schedules[scheduleId] = ThinningSchedule({
            scheduleId: scheduleId,
            farmer: msg.sender,
            fieldId: fieldId,
            scheduledDate: scheduledDate,
            completedDate: 0,
            plantsRemoved: plantsRemoved,
            spacing: spacing,
            isCompleted: false
        });

        schedulesByFarmer[msg.sender].push(scheduleId);
        emit ScheduleCreated(scheduleId, msg.sender, fieldId);
        return scheduleId;
    }

    function completeThinning(uint256 scheduleId) public {
        require(schedules[scheduleId].farmer == msg.sender, "Not schedule owner");
        schedules[scheduleId].completedDate = block.timestamp;
        schedules[scheduleId].isCompleted = true;
    }

    function getSchedule(uint256 scheduleId) public view returns (ThinningSchedule memory) {
        return schedules[scheduleId];
    }
}

