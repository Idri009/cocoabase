// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilNutrientBalance
 * @dev Onchain soil nutrient balance tracking and recommendations
 */
contract FarmSoilNutrientBalance is Ownable {
    struct NutrientBalance {
        uint256 balanceId;
        address farmer;
        string fieldId;
        uint256 nitrogen;
        uint256 phosphorus;
        uint256 potassium;
        uint256 timestamp;
        string recommendation;
    }

    mapping(uint256 => NutrientBalance) public balances;
    mapping(address => uint256[]) public balancesByFarmer;
    uint256 private _balanceIdCounter;

    event BalanceRecorded(
        uint256 indexed balanceId,
        address indexed farmer,
        string fieldId
    );

    constructor() Ownable(msg.sender) {}

    function recordBalance(
        string memory fieldId,
        uint256 nitrogen,
        uint256 phosphorus,
        uint256 potassium,
        string memory recommendation
    ) public returns (uint256) {
        uint256 balanceId = _balanceIdCounter++;
        balances[balanceId] = NutrientBalance({
            balanceId: balanceId,
            farmer: msg.sender,
            fieldId: fieldId,
            nitrogen: nitrogen,
            phosphorus: phosphorus,
            potassium: potassium,
            timestamp: block.timestamp,
            recommendation: recommendation
        });

        balancesByFarmer[msg.sender].push(balanceId);
        emit BalanceRecorded(balanceId, msg.sender, fieldId);
        return balanceId;
    }

    function getBalance(uint256 balanceId) public view returns (NutrientBalance memory) {
        return balances[balanceId];
    }
}

