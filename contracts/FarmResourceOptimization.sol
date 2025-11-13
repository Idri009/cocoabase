// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmResourceOptimization
 * @dev Onchain resource optimization system
 */
contract FarmResourceOptimization is Ownable {
    struct OptimizationPlan {
        uint256 planId;
        address farmOwner;
        string resourceType;
        uint256 currentUsage;
        uint256 optimalUsage;
        uint256 savings;
        uint256 date;
        bool implemented;
    }

    mapping(uint256 => OptimizationPlan) public plans;
    mapping(address => uint256[]) public plansByOwner;
    uint256 private _planIdCounter;

    event PlanCreated(
        uint256 indexed planId,
        address indexed farmOwner,
        string resourceType
    );

    event PlanImplemented(
        uint256 indexed planId,
        uint256 savings
    );

    constructor() Ownable(msg.sender) {}

    function createOptimizationPlan(
        string memory resourceType,
        uint256 currentUsage,
        uint256 optimalUsage
    ) public returns (uint256) {
        uint256 savings = currentUsage > optimalUsage ? currentUsage - optimalUsage : 0;

        uint256 planId = _planIdCounter++;
        plans[planId] = OptimizationPlan({
            planId: planId,
            farmOwner: msg.sender,
            resourceType: resourceType,
            currentUsage: currentUsage,
            optimalUsage: optimalUsage,
            savings: savings,
            date: block.timestamp,
            implemented: false
        });

        plansByOwner[msg.sender].push(planId);

        emit PlanCreated(planId, msg.sender, resourceType);
        return planId;
    }

    function implementPlan(uint256 planId) public {
        OptimizationPlan storage plan = plans[planId];
        require(plan.farmOwner == msg.sender, "Not the owner");
        require(!plan.implemented, "Already implemented");

        plan.implemented = true;

        emit PlanImplemented(planId, plan.savings);
    }

    function getPlan(uint256 planId) public view returns (OptimizationPlan memory) {
        return plans[planId];
    }

    function getPlansByOwner(address owner) public view returns (uint256[] memory) {
        return plansByOwner[owner];
    }
}

