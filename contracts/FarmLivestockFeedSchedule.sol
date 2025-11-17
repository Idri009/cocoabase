// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockFeedSchedule
 * @dev Onchain feed scheduling and ration management
 */
contract FarmLivestockFeedSchedule is Ownable {
    struct FeedSchedule {
        uint256 scheduleId;
        address farmer;
        string livestockId;
        string feedType;
        uint256 quantity;
        uint256 feedingTime;
        uint256 frequency;
        bool isActive;
    }

    mapping(uint256 => FeedSchedule) public schedules;
    mapping(address => uint256[]) public schedulesByFarmer;
    uint256 private _scheduleIdCounter;

    event ScheduleCreated(
        uint256 indexed scheduleId,
        address indexed farmer,
        string livestockId,
        string feedType
    );

    constructor() Ownable(msg.sender) {}

    function createSchedule(
        string memory livestockId,
        string memory feedType,
        uint256 quantity,
        uint256 feedingTime,
        uint256 frequency
    ) public returns (uint256) {
        uint256 scheduleId = _scheduleIdCounter++;
        schedules[scheduleId] = FeedSchedule({
            scheduleId: scheduleId,
            farmer: msg.sender,
            livestockId: livestockId,
            feedType: feedType,
            quantity: quantity,
            feedingTime: feedingTime,
            frequency: frequency,
            isActive: true
        });

        schedulesByFarmer[msg.sender].push(scheduleId);
        emit ScheduleCreated(scheduleId, msg.sender, livestockId, feedType);
        return scheduleId;
    }

    function getSchedule(uint256 scheduleId) public view returns (FeedSchedule memory) {
        return schedules[scheduleId];
    }
}
