// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropIntercroppingOptimization
 * @dev Intercropping optimization system
 */
contract FarmCropIntercroppingOptimization is Ownable {
    struct Intercrop {
        uint256 intercropId;
        address farmer;
        uint256 fieldId;
        string primaryCrop;
        string secondaryCrop;
        uint256 yieldIncrease;
        bool optimal;
    }

    mapping(uint256 => Intercrop) public intercroppings;
    mapping(address => uint256[]) public intercroppingsByFarmer;
    uint256 private _intercropIdCounter;

    event IntercropCreated(uint256 indexed intercropId, string primaryCrop);

    constructor() Ownable(msg.sender) {}

    function createIntercrop(
        uint256 fieldId,
        string memory primaryCrop,
        string memory secondaryCrop,
        uint256 yieldIncrease
    ) public returns (uint256) {
        bool optimal = yieldIncrease > 10;
        uint256 intercropId = _intercropIdCounter++;
        intercroppings[intercropId] = Intercrop({
            intercropId: intercropId,
            farmer: msg.sender,
            fieldId: fieldId,
            primaryCrop: primaryCrop,
            secondaryCrop: secondaryCrop,
            yieldIncrease: yieldIncrease,
            optimal: optimal
        });
        intercroppingsByFarmer[msg.sender].push(intercropId);
        emit IntercropCreated(intercropId, primaryCrop);
        return intercropId;
    }
}

