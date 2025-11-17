// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmEnergyOptimization
 * @dev Energy optimization recommendations and tracking
 */
contract FarmEnergyOptimization is Ownable {
    struct OptimizationPlan {
        uint256 planId;
        address farmer;
        string equipmentType;
        uint256 currentConsumption;
        uint256 targetConsumption;
        uint256 estimatedSavings;
        uint256 implementationDate;
    }

    mapping(uint256 => OptimizationPlan) public plans;
    mapping(address => uint256[]) public plansByFarmer;
    uint256 private _planIdCounter;

    event PlanCreated(
        uint256 indexed planId,
        address indexed farmer,
        uint256 estimatedSavings
    );

    constructor() Ownable(msg.sender) {}

    function createPlan(
        string memory equipmentType,
        uint256 currentConsumption,
        uint256 targetConsumption
    ) public returns (uint256) {
        require(targetConsumption < currentConsumption, "Invalid target");
        uint256 estimatedSavings = currentConsumption - targetConsumption;
        uint256 planId = _planIdCounter++;
        plans[planId] = OptimizationPlan({
            planId: planId,
            farmer: msg.sender,
            equipmentType: equipmentType,
            currentConsumption: currentConsumption,
            targetConsumption: targetConsumption,
            estimatedSavings: estimatedSavings,
            implementationDate: 0
        });

        plansByFarmer[msg.sender].push(planId);
        emit PlanCreated(planId, msg.sender, estimatedSavings);
        return planId;
    }

    function implementPlan(uint256 planId) public {
        require(plans[planId].farmer == msg.sender, "Not authorized");
        plans[planId].implementationDate = block.timestamp;
    }

    function getPlan(uint256 planId) public view returns (OptimizationPlan memory) {
        return plans[planId];
    }
}
