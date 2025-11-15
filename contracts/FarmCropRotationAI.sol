// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropRotationAI
 * @dev AI-powered crop rotation optimization recommendations
 */
contract FarmCropRotationAI is Ownable {
    struct RotationPlan {
        uint256 planId;
        address farmer;
        string fieldId;
        string[] crops;
        uint256[] plantingDates;
        uint256 expectedYield;
        uint256 soilHealthScore;
        bool recommended;
    }

    mapping(uint256 => RotationPlan) public rotationPlans;
    mapping(address => uint256[]) public plansByFarmer;
    uint256 private _planIdCounter;

    event PlanCreated(
        uint256 indexed planId,
        address indexed farmer,
        string fieldId
    );

    constructor() Ownable(msg.sender) {}

    function createRotationPlan(
        string memory fieldId,
        string[] memory crops,
        uint256[] memory plantingDates,
        uint256 expectedYield,
        uint256 soilHealthScore
    ) public returns (uint256) {
        require(crops.length == plantingDates.length, "Array length mismatch");
        uint256 planId = _planIdCounter++;
        rotationPlans[planId] = RotationPlan({
            planId: planId,
            farmer: msg.sender,
            fieldId: fieldId,
            crops: crops,
            plantingDates: plantingDates,
            expectedYield: expectedYield,
            soilHealthScore: soilHealthScore,
            recommended: false
        });

        plansByFarmer[msg.sender].push(planId);
        emit PlanCreated(planId, msg.sender, fieldId);
        return planId;
    }

    function markAsRecommended(uint256 planId) public onlyOwner {
        rotationPlans[planId].recommended = true;
    }

    function getPlan(uint256 planId) public view returns (RotationPlan memory) {
        return rotationPlans[planId];
    }
}
