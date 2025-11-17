// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropRotationPlanner
 * @dev AI-powered crop rotation planning system
 */
contract FarmCropRotationPlanner is Ownable {
    struct RotationPlan {
        uint256 planId;
        address farmer;
        string fieldId;
        string[] cropSequence;
        uint256[] plantingDates;
        uint256 planDate;
    }

    mapping(uint256 => RotationPlan) public plans;
    mapping(address => uint256[]) public plansByFarmer;
    uint256 private _planIdCounter;

    event PlanCreated(
        uint256 indexed planId,
        address indexed farmer,
        string fieldId
    );

    constructor() Ownable(msg.sender) {}

    function createPlan(
        string memory fieldId,
        string[] memory cropSequence,
        uint256[] memory plantingDates
    ) public returns (uint256) {
        require(cropSequence.length == plantingDates.length, "Mismatch");
        uint256 planId = _planIdCounter++;
        plans[planId] = RotationPlan({
            planId: planId,
            farmer: msg.sender,
            fieldId: fieldId,
            cropSequence: cropSequence,
            plantingDates: plantingDates,
            planDate: block.timestamp
        });

        plansByFarmer[msg.sender].push(planId);
        emit PlanCreated(planId, msg.sender, fieldId);
        return planId;
    }

    function getPlan(uint256 planId) public view returns (RotationPlan memory) {
        return plans[planId];
    }
}
