// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilNutrientBalance
 * @dev Soil nutrient balance tracking and optimization
 */
contract FarmSoilNutrientBalance is Ownable {
    struct NutrientBalance {
        uint256 balanceId;
        uint256 fieldId;
        uint256 nitrogen;
        uint256 phosphorus;
        uint256 potassium;
        uint256 timestamp;
        bool optimal;
    }

    mapping(uint256 => NutrientBalance) public balances;
    mapping(uint256 => uint256[]) public balancesByField;
    uint256 private _balanceIdCounter;

    event BalanceRecorded(uint256 indexed balanceId, uint256 fieldId, bool optimal);

    constructor() Ownable(msg.sender) {}

    function recordBalance(
        uint256 fieldId,
        uint256 nitrogen,
        uint256 phosphorus,
        uint256 potassium
    ) public returns (uint256) {
        bool optimal = nitrogen >= 20 && nitrogen <= 40 &&
                      phosphorus >= 10 && phosphorus <= 30 &&
                      potassium >= 15 && potassium <= 35;
        uint256 balanceId = _balanceIdCounter++;
        balances[balanceId] = NutrientBalance({
            balanceId: balanceId,
            fieldId: fieldId,
            nitrogen: nitrogen,
            phosphorus: phosphorus,
            potassium: potassium,
            timestamp: block.timestamp,
            optimal: optimal
        });
        balancesByField[fieldId].push(balanceId);
        emit BalanceRecorded(balanceId, fieldId, optimal);
        return balanceId;
    }
}
