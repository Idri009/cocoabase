// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropClimateAdaptationStrategy
 * @dev Onchain climate adaptation strategies and implementation tracking
 */
contract FarmCropClimateAdaptationStrategy is Ownable {
    struct AdaptationStrategy {
        uint256 strategyId;
        address farmer;
        string fieldId;
        string strategyType;
        string implementation;
        uint256 implementationDate;
        uint256 effectiveness;
        bool isActive;
    }

    mapping(uint256 => AdaptationStrategy) public strategies;
    mapping(address => uint256[]) public strategiesByFarmer;
    uint256 private _strategyIdCounter;

    event StrategyRecorded(
        uint256 indexed strategyId,
        address indexed farmer,
        string fieldId,
        string strategyType
    );

    constructor() Ownable(msg.sender) {}

    function recordStrategy(
        string memory fieldId,
        string memory strategyType,
        string memory implementation,
        uint256 effectiveness
    ) public returns (uint256) {
        uint256 strategyId = _strategyIdCounter++;
        strategies[strategyId] = AdaptationStrategy({
            strategyId: strategyId,
            farmer: msg.sender,
            fieldId: fieldId,
            strategyType: strategyType,
            implementation: implementation,
            implementationDate: block.timestamp,
            effectiveness: effectiveness,
            isActive: true
        });

        strategiesByFarmer[msg.sender].push(strategyId);
        emit StrategyRecorded(strategyId, msg.sender, fieldId, strategyType);
        return strategyId;
    }

    function getStrategy(uint256 strategyId) public view returns (AdaptationStrategy memory) {
        return strategies[strategyId];
    }
}

