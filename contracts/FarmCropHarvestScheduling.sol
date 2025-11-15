// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropHarvestScheduling
 * @dev Onchain harvest scheduling and optimization system
 */
contract FarmCropHarvestScheduling is Ownable {
    struct HarvestSchedule {
        uint256 scheduleId;
        address farmer;
        string cropType;
        string fieldId;
        uint256 plannedDate;
        uint256 actualDate;
        uint256 estimatedYield;
        bool isCompleted;
    }

    mapping(uint256 => HarvestSchedule) public schedules;
    mapping(address => uint256[]) public schedulesByFarmer;
    uint256 private _scheduleIdCounter;

    event ScheduleCreated(
        uint256 indexed scheduleId,
        address indexed farmer,
        string cropType
    );

    constructor() Ownable(msg.sender) {}

    function createSchedule(
        string memory cropType,
        string memory fieldId,
        uint256 plannedDate,
        uint256 estimatedYield
    ) public returns (uint256) {
        uint256 scheduleId = _scheduleIdCounter++;
        schedules[scheduleId] = HarvestSchedule({
            scheduleId: scheduleId,
            farmer: msg.sender,
            cropType: cropType,
            fieldId: fieldId,
            plannedDate: plannedDate,
            actualDate: 0,
            estimatedYield: estimatedYield,
            isCompleted: false
        });

        schedulesByFarmer[msg.sender].push(scheduleId);
        emit ScheduleCreated(scheduleId, msg.sender, cropType);
        return scheduleId;
    }

    function completeHarvest(uint256 scheduleId, uint256 actualDate) public {
        require(schedules[scheduleId].farmer == msg.sender, "Not schedule owner");
        schedules[scheduleId].actualDate = actualDate;
        schedules[scheduleId].isCompleted = true;
    }

    function getSchedule(uint256 scheduleId) public view returns (HarvestSchedule memory) {
        return schedules[scheduleId];
    }
}

