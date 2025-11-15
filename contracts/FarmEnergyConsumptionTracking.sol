// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmEnergyConsumptionTracking
 * @dev Onchain energy consumption tracking for farms
 */
contract FarmEnergyConsumptionTracking is Ownable {
    struct EnergyConsumption {
        uint256 consumptionId;
        address farmer;
        string energyType;
        uint256 amount;
        string unit;
        uint256 timestamp;
        string source;
    }

    mapping(uint256 => EnergyConsumption) public consumptions;
    mapping(address => uint256[]) public consumptionsByFarmer;
    mapping(address => uint256) public totalConsumptionByFarmer;
    uint256 private _consumptionIdCounter;

    event EnergyConsumptionRecorded(
        uint256 indexed consumptionId,
        address indexed farmer,
        string energyType,
        uint256 amount
    );

    constructor() Ownable(msg.sender) {}

    function recordConsumption(
        string memory energyType,
        uint256 amount,
        string memory unit,
        string memory source
    ) public returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");

        uint256 consumptionId = _consumptionIdCounter++;
        consumptions[consumptionId] = EnergyConsumption({
            consumptionId: consumptionId,
            farmer: msg.sender,
            energyType: energyType,
            amount: amount,
            unit: unit,
            timestamp: block.timestamp,
            source: source
        });

        consumptionsByFarmer[msg.sender].push(consumptionId);
        totalConsumptionByFarmer[msg.sender] += amount;

        emit EnergyConsumptionRecorded(consumptionId, msg.sender, energyType, amount);
        return consumptionId;
    }

    function getConsumption(uint256 consumptionId) public view returns (EnergyConsumption memory) {
        return consumptions[consumptionId];
    }

    function getTotalConsumption(address farmer) public view returns (uint256) {
        return totalConsumptionByFarmer[farmer];
    }
}

