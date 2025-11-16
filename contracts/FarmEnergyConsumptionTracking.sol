// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmEnergyConsumptionTracking
 * @dev Energy consumption tracking for farms
 */
contract FarmEnergyConsumptionTracking is Ownable {
    struct EnergyRecord {
        uint256 recordId;
        address farmer;
        uint256 farmId;
        uint256 consumption;
        string energyType;
        uint256 timestamp;
    }

    mapping(uint256 => EnergyRecord) public energyRecords;
    mapping(address => uint256[]) public recordsByFarmer;
    mapping(uint256 => uint256) public totalConsumptionByFarm;
    uint256 private _recordIdCounter;

    event EnergyRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        uint256 consumption
    );

    constructor() Ownable(msg.sender) {}

    function recordConsumption(
        uint256 farmId,
        uint256 consumption,
        string memory energyType
    ) public returns (uint256) {
        require(consumption > 0, "Invalid consumption");
        uint256 recordId = _recordIdCounter++;
        energyRecords[recordId] = EnergyRecord({
            recordId: recordId,
            farmer: msg.sender,
            farmId: farmId,
            consumption: consumption,
            energyType: energyType,
            timestamp: block.timestamp
        });
        recordsByFarmer[msg.sender].push(recordId);
        totalConsumptionByFarm[farmId] += consumption;
        emit EnergyRecorded(recordId, msg.sender, consumption);
        return recordId;
    }

    function getTotalConsumption(uint256 farmId) public view returns (uint256) {
        return totalConsumptionByFarm[farmId];
    }
}
