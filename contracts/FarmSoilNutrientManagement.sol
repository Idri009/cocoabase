// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilNutrientManagement
 * @dev Comprehensive soil nutrient management system
 */
contract FarmSoilNutrientManagement is Ownable {
    struct NutrientPlan {
        uint256 planId;
        address farmer;
        string fieldId;
        uint256 nitrogen;
        uint256 phosphorus;
        uint256 potassium;
        uint256 applicationDate;
        bool applied;
    }

    mapping(uint256 => NutrientPlan) public plans;
    mapping(address => uint256[]) public plansByFarmer;
    uint256 private _planIdCounter;

    event PlanCreated(
        uint256 indexed planId,
        address indexed farmer,
        string fieldId
    );

    event NutrientsApplied(
        uint256 indexed planId,
        uint256 applicationDate
    );

    constructor() Ownable(msg.sender) {}

    function createPlan(
        string memory fieldId,
        uint256 nitrogen,
        uint256 phosphorus,
        uint256 potassium,
        uint256 applicationDate
    ) public returns (uint256) {
        uint256 planId = _planIdCounter++;
        plans[planId] = NutrientPlan({
            planId: planId,
            farmer: msg.sender,
            fieldId: fieldId,
            nitrogen: nitrogen,
            phosphorus: phosphorus,
            potassium: potassium,
            applicationDate: applicationDate,
            applied: false
        });

        plansByFarmer[msg.sender].push(planId);
        emit PlanCreated(planId, msg.sender, fieldId);
        return planId;
    }

    function applyNutrients(uint256 planId) public {
        require(plans[planId].farmer == msg.sender, "Not authorized");
        plans[planId].applied = true;
        emit NutrientsApplied(planId, block.timestamp);
    }

    function getPlan(uint256 planId) public view returns (NutrientPlan memory) {
        return plans[planId];
    }
}
