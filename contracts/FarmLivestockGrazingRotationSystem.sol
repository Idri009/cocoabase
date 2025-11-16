// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockGrazingRotationSystem
 * @dev Onchain grazing rotation scheduling and pasture management
 */
contract FarmLivestockGrazingRotationSystem is Ownable {
    struct RotationSchedule {
        uint256 scheduleId;
        address farmer;
        string livestockGroupId;
        string currentPasture;
        string nextPasture;
        uint256 rotationDate;
        uint256 grazingDuration;
        bool isActive;
    }

    mapping(uint256 => RotationSchedule) public schedules;
    mapping(address => uint256[]) public schedulesByFarmer;
    uint256 private _scheduleIdCounter;

    event RotationScheduled(
        uint256 indexed scheduleId,
        address indexed farmer,
        string livestockGroupId,
        string nextPasture
    );

    constructor() Ownable(msg.sender) {}

    function scheduleRotation(
        string memory livestockGroupId,
        string memory currentPasture,
        string memory nextPasture,
        uint256 rotationDate,
        uint256 grazingDuration
    ) public returns (uint256) {
        uint256 scheduleId = _scheduleIdCounter++;
        schedules[scheduleId] = RotationSchedule({
            scheduleId: scheduleId,
            farmer: msg.sender,
            livestockGroupId: livestockGroupId,
            currentPasture: currentPasture,
            nextPasture: nextPasture,
            rotationDate: rotationDate,
            grazingDuration: grazingDuration,
            isActive: true
        });

        schedulesByFarmer[msg.sender].push(scheduleId);
        emit RotationScheduled(scheduleId, msg.sender, livestockGroupId, nextPasture);
        return scheduleId;
    }

    function completeRotation(uint256 scheduleId) public {
        require(schedules[scheduleId].farmer == msg.sender, "Not schedule owner");
        schedules[scheduleId].isActive = false;
    }

    function getSchedule(uint256 scheduleId) public view returns (RotationSchedule memory) {
        return schedules[scheduleId];
    }
}

