// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropCoverCropSchedule
 * @dev Onchain cover crop planting and management schedule
 */
contract FarmCropCoverCropSchedule is Ownable {
    struct CoverCropSchedule {
        uint256 scheduleId;
        address farmer;
        string fieldId;
        string coverCropType;
        uint256 plantingDate;
        uint256 terminationDate;
        string purpose;
        bool isTerminated;
    }

    mapping(uint256 => CoverCropSchedule) public schedules;
    mapping(address => uint256[]) public schedulesByFarmer;
    uint256 private _scheduleIdCounter;

    event ScheduleCreated(
        uint256 indexed scheduleId,
        address indexed farmer,
        string fieldId,
        string coverCropType
    );

    constructor() Ownable(msg.sender) {}

    function createSchedule(
        string memory fieldId,
        string memory coverCropType,
        uint256 plantingDate,
        string memory purpose
    ) public returns (uint256) {
        uint256 scheduleId = _scheduleIdCounter++;
        schedules[scheduleId] = CoverCropSchedule({
            scheduleId: scheduleId,
            farmer: msg.sender,
            fieldId: fieldId,
            coverCropType: coverCropType,
            plantingDate: plantingDate,
            terminationDate: 0,
            purpose: purpose,
            isTerminated: false
        });

        schedulesByFarmer[msg.sender].push(scheduleId);
        emit ScheduleCreated(scheduleId, msg.sender, fieldId, coverCropType);
        return scheduleId;
    }

    function terminateCoverCrop(uint256 scheduleId, uint256 terminationDate) public {
        require(schedules[scheduleId].farmer == msg.sender, "Not schedule owner");
        schedules[scheduleId].terminationDate = terminationDate;
        schedules[scheduleId].isTerminated = true;
    }

    function getSchedule(uint256 scheduleId) public view returns (CoverCropSchedule memory) {
        return schedules[scheduleId];
    }
}

