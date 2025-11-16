// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmHarvestLogistics
 * @dev Harvest logistics coordination
 */
contract FarmHarvestLogistics is Ownable {
    struct LogisticsPlan {
        uint256 planId;
        address coordinator;
        uint256 harvestId;
        address[] transporters;
        uint256 pickupDate;
        uint256 deliveryDate;
        bool completed;
    }

    mapping(uint256 => LogisticsPlan) public logisticsPlans;
    mapping(address => uint256[]) public plansByCoordinator;
    uint256 private _planIdCounter;

    event PlanCreated(uint256 indexed planId, address indexed coordinator);
    event TransporterAdded(uint256 indexed planId, address transporter);
    event PlanCompleted(uint256 indexed planId);

    constructor() Ownable(msg.sender) {}

    function createPlan(
        uint256 harvestId,
        address[] memory transporters,
        uint256 pickupDate,
        uint256 deliveryDate
    ) public returns (uint256) {
        require(pickupDate < deliveryDate, "Invalid dates");
        uint256 planId = _planIdCounter++;
        logisticsPlans[planId] = LogisticsPlan({
            planId: planId,
            coordinator: msg.sender,
            harvestId: harvestId,
            transporters: transporters,
            pickupDate: pickupDate,
            deliveryDate: deliveryDate,
            completed: false
        });
        plansByCoordinator[msg.sender].push(planId);
        emit PlanCreated(planId, msg.sender);
        return planId;
    }

    function completePlan(uint256 planId) public {
        LogisticsPlan storage plan = logisticsPlans[planId];
        require(plan.coordinator == msg.sender, "Not the coordinator");
        require(!plan.completed, "Already completed");
        plan.completed = true;
        emit PlanCompleted(planId);
    }
}

