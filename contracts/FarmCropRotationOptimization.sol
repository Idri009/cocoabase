// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropRotationOptimization
 * @dev Onchain crop rotation planning and optimization
 */
contract FarmCropRotationOptimization is Ownable {
    struct RotationPlan {
        uint256 planId;
        address farmer;
        string fieldId;
        string currentCrop;
        string nextCrop;
        uint256 rotationDate;
        string benefits;
    }

    mapping(uint256 => RotationPlan) public plans;
    mapping(address => uint256[]) public plansByFarmer;
    uint256 private _planIdCounter;

    event PlanCreated(
        uint256 indexed planId,
        address indexed farmer,
        string fieldId,
        string nextCrop
    );

    constructor() Ownable(msg.sender) {}

    function createPlan(
        string memory fieldId,
        string memory currentCrop,
        string memory nextCrop,
        uint256 rotationDate,
        string memory benefits
    ) public returns (uint256) {
        uint256 planId = _planIdCounter++;
        plans[planId] = RotationPlan({
            planId: planId,
            farmer: msg.sender,
            fieldId: fieldId,
            currentCrop: currentCrop,
            nextCrop: nextCrop,
            rotationDate: rotationDate,
            benefits: benefits
        });

        plansByFarmer[msg.sender].push(planId);
        emit PlanCreated(planId, msg.sender, fieldId, nextCrop);
        return planId;
    }

    function getPlan(uint256 planId) public view returns (RotationPlan memory) {
        return plans[planId];
    }
}
