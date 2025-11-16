// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmOrganicTransitionSupport
 * @dev Support system for organic transition period tracking
 */
contract FarmOrganicTransitionSupport is Ownable {
    struct TransitionPlan {
        uint256 planId;
        address farmer;
        uint256 startDate;
        uint256 expectedCompletionDate;
        uint256 progressPercentage;
        bool completed;
    }

    mapping(uint256 => TransitionPlan) public plans;
    mapping(address => uint256[]) public plansByFarmer;
    uint256 private _planIdCounter;

    event TransitionStarted(
        uint256 indexed planId,
        address indexed farmer,
        uint256 expectedCompletionDate
    );

    event ProgressUpdated(
        uint256 indexed planId,
        uint256 progressPercentage
    );

    constructor() Ownable(msg.sender) {}

    function startTransition(
        uint256 expectedCompletionDate
    ) public returns (uint256) {
        uint256 planId = _planIdCounter++;
        plans[planId] = TransitionPlan({
            planId: planId,
            farmer: msg.sender,
            startDate: block.timestamp,
            expectedCompletionDate: expectedCompletionDate,
            progressPercentage: 0,
            completed: false
        });

        plansByFarmer[msg.sender].push(planId);
        emit TransitionStarted(planId, msg.sender, expectedCompletionDate);
        return planId;
    }

    function updateProgress(uint256 planId, uint256 progressPercentage) public {
        require(plans[planId].farmer == msg.sender, "Not authorized");
        require(progressPercentage <= 100, "Invalid percentage");
        plans[planId].progressPercentage = progressPercentage;
        if (progressPercentage >= 100) {
            plans[planId].completed = true;
        }
        emit ProgressUpdated(planId, progressPercentage);
    }

    function getPlan(uint256 planId) public view returns (TransitionPlan memory) {
        return plans[planId];
    }
}
