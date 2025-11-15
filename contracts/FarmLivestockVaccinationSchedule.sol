// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockVaccinationSchedule
 * @dev Onchain vaccination scheduling and tracking for livestock
 */
contract FarmLivestockVaccinationSchedule is Ownable {
    struct VaccinationSchedule {
        uint256 scheduleId;
        address farmer;
        string livestockId;
        string vaccineType;
        uint256 scheduledDate;
        uint256 administeredDate;
        bool isCompleted;
    }

    mapping(uint256 => VaccinationSchedule) public schedules;
    mapping(address => uint256[]) public schedulesByFarmer;
    uint256 private _scheduleIdCounter;

    event ScheduleCreated(
        uint256 indexed scheduleId,
        address indexed farmer,
        string livestockId
    );

    constructor() Ownable(msg.sender) {}

    function createSchedule(
        string memory livestockId,
        string memory vaccineType,
        uint256 scheduledDate
    ) public returns (uint256) {
        uint256 scheduleId = _scheduleIdCounter++;
        schedules[scheduleId] = VaccinationSchedule({
            scheduleId: scheduleId,
            farmer: msg.sender,
            livestockId: livestockId,
            vaccineType: vaccineType,
            scheduledDate: scheduledDate,
            administeredDate: 0,
            isCompleted: false
        });

        schedulesByFarmer[msg.sender].push(scheduleId);
        emit ScheduleCreated(scheduleId, msg.sender, livestockId);
        return scheduleId;
    }

    function recordAdministration(uint256 scheduleId) public {
        require(schedules[scheduleId].farmer == msg.sender, "Not schedule owner");
        schedules[scheduleId].administeredDate = block.timestamp;
        schedules[scheduleId].isCompleted = true;
    }

    function getSchedule(uint256 scheduleId) public view returns (VaccinationSchedule memory) {
        return schedules[scheduleId];
    }
}

