// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropThinningOptimization
 * @dev Optimize crop thinning operations for better yields
 */
contract FarmCropThinningOptimization is Ownable {
    struct ThinningPlan {
        uint256 planId;
        address farmer;
        string fieldId;
        uint256 plantsBefore;
        uint256 plantsAfter;
        uint256 expectedYieldIncrease;
        uint256 executionDate;
    }

    mapping(uint256 => ThinningPlan) public plans;
    mapping(address => uint256[]) public plansByFarmer;
    uint256 private _planIdCounter;

    event PlanCreated(
        uint256 indexed planId,
        address indexed farmer,
        string fieldId
    );

    event PlanExecuted(
        uint256 indexed planId,
        uint256 plantsRemoved
    );

    constructor() Ownable(msg.sender) {}

    function createPlan(
        string memory fieldId,
        uint256 plantsBefore,
        uint256 plantsAfter,
        uint256 expectedYieldIncrease
    ) public returns (uint256) {
        require(plantsAfter < plantsBefore, "Invalid thinning");
        uint256 planId = _planIdCounter++;
        plans[planId] = ThinningPlan({
            planId: planId,
            farmer: msg.sender,
            fieldId: fieldId,
            plantsBefore: plantsBefore,
            plantsAfter: plantsAfter,
            expectedYieldIncrease: expectedYieldIncrease,
            executionDate: 0
        });

        plansByFarmer[msg.sender].push(planId);
        emit PlanCreated(planId, msg.sender, fieldId);
        return planId;
    }

    function executePlan(uint256 planId) public {
        require(plans[planId].farmer == msg.sender, "Not authorized");
        require(plans[planId].executionDate == 0, "Already executed");
        plans[planId].executionDate = block.timestamp;
        emit PlanExecuted(planId, plans[planId].plantsBefore - plans[planId].plantsAfter);
    }

    function getPlan(uint256 planId) public view returns (ThinningPlan memory) {
        return plans[planId];
    }
}
