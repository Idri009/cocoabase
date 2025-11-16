// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropThinningOptimization
 * @dev Onchain crop thinning optimization for better yields
 */
contract FarmCropThinningOptimization is Ownable {
    struct ThinningOptimization {
        uint256 optimizationId;
        address farmer;
        string fieldId;
        uint256 plantsBefore;
        uint256 plantsAfter;
        uint256 optimalSpacing;
        uint256 expectedYieldIncrease;
        uint256 optimizationDate;
    }

    mapping(uint256 => ThinningOptimization) public optimizations;
    mapping(address => uint256[]) public optimizationsByFarmer;
    uint256 private _optimizationIdCounter;

    event OptimizationRecorded(
        uint256 indexed optimizationId,
        address indexed farmer,
        string fieldId,
        uint256 expectedYieldIncrease
    );

    constructor() Ownable(msg.sender) {}

    function recordOptimization(
        string memory fieldId,
        uint256 plantsBefore,
        uint256 plantsAfter,
        uint256 optimalSpacing,
        uint256 expectedYieldIncrease
    ) public returns (uint256) {
        uint256 optimizationId = _optimizationIdCounter++;
        optimizations[optimizationId] = ThinningOptimization({
            optimizationId: optimizationId,
            farmer: msg.sender,
            fieldId: fieldId,
            plantsBefore: plantsBefore,
            plantsAfter: plantsAfter,
            optimalSpacing: optimalSpacing,
            expectedYieldIncrease: expectedYieldIncrease,
            optimizationDate: block.timestamp
        });

        optimizationsByFarmer[msg.sender].push(optimizationId);
        emit OptimizationRecorded(optimizationId, msg.sender, fieldId, expectedYieldIncrease);
        return optimizationId;
    }

    function getOptimization(uint256 optimizationId) public view returns (ThinningOptimization memory) {
        return optimizations[optimizationId];
    }
}
