// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropFertilizationSchedule
 * @dev Fertilization scheduling and application tracking
 */
contract FarmCropFertilizationSchedule is Ownable {
    struct FertilizationEvent {
        uint256 eventId;
        address farmer;
        string fieldId;
        string fertilizerType;
        uint256 quantity;
        uint256 scheduledDate;
        uint256 appliedDate;
        bool completed;
    }

    mapping(uint256 => FertilizationEvent) public events;
    mapping(address => uint256[]) public eventsByFarmer;
    uint256 private _eventIdCounter;

    event ScheduleCreated(
        uint256 indexed eventId,
        address indexed farmer,
        uint256 scheduledDate
    );

    constructor() Ownable(msg.sender) {}

    function createSchedule(
        string memory fieldId,
        string memory fertilizerType,
        uint256 quantity,
        uint256 scheduledDate
    ) public returns (uint256) {
        uint256 eventId = _eventIdCounter++;
        events[eventId] = FertilizationEvent({
            eventId: eventId,
            farmer: msg.sender,
            fieldId: fieldId,
            fertilizerType: fertilizerType,
            quantity: quantity,
            scheduledDate: scheduledDate,
            appliedDate: 0,
            completed: false
        });

        eventsByFarmer[msg.sender].push(eventId);
        emit ScheduleCreated(eventId, msg.sender, scheduledDate);
        return eventId;
    }

    function recordApplication(uint256 eventId) public {
        require(events[eventId].farmer == msg.sender, "Not authorized");
        events[eventId].completed = true;
        events[eventId].appliedDate = block.timestamp;
    }

    function getEvent(uint256 eventId) public view returns (FertilizationEvent memory) {
        return events[eventId];
    }
}
