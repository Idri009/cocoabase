// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropRotationOptimization
 * @dev Onchain system for optimizing crop rotation schedules
 */
contract FarmCropRotationOptimization is Ownable {
    struct RotationPlan {
        uint256 planId;
        uint256 plantationId;
        string[] cropSequence;
        uint256[] rotationPeriods;
        address planner;
        uint256 startDate;
        bool active;
    }

    mapping(uint256 => RotationPlan) public rotationPlans;
    mapping(address => uint256[]) public plansByPlanner;
    uint256 private _planIdCounter;

    event RotationPlanCreated(
        uint256 indexed planId,
        address indexed planner,
        uint256 plantationId
    );

    event RotationPlanActivated(uint256 indexed planId);

    constructor() Ownable(msg.sender) {}

    function createRotationPlan(
        uint256 plantationId,
        string[] memory cropSequence,
        uint256[] memory rotationPeriods
    ) public returns (uint256) {
        uint256 planId = _planIdCounter++;
        rotationPlans[planId] = RotationPlan({
            planId: planId,
            plantationId: plantationId,
            cropSequence: cropSequence,
            rotationPeriods: rotationPeriods,
            planner: msg.sender,
            startDate: block.timestamp,
            active: false
        });

        plansByPlanner[msg.sender].push(planId);

        emit RotationPlanCreated(planId, msg.sender, plantationId);
        return planId;
    }

    function activatePlan(uint256 planId) public {
        require(rotationPlans[planId].planner == msg.sender, "Not the planner");
        rotationPlans[planId].active = true;
        emit RotationPlanActivated(planId);
    }

    function getPlan(uint256 planId) public view returns (RotationPlan memory) {
        return rotationPlans[planId];
    }
}
