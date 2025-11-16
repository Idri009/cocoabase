// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmEnergyConsumptionTracking
 * @dev Onchain energy consumption tracking and optimization system
 */
contract FarmEnergyConsumptionTracking is Ownable {
    struct EnergyRecord {
        uint256 recordId;
        address farmer;
        string energySource;
        uint256 consumption;
        string unit;
        uint256 recordDate;
        uint256 cost;
        string efficiency;
    }

    mapping(uint256 => EnergyRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event EnergyRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string energySource,
        uint256 consumption
    );

    constructor() Ownable(msg.sender) {}

    function recordConsumption(
        string memory energySource,
        uint256 consumption,
        string memory unit,
        uint256 cost,
        string memory efficiency
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = EnergyRecord({
            recordId: recordId,
            farmer: msg.sender,
            energySource: energySource,
            consumption: consumption,
            unit: unit,
            recordDate: block.timestamp,
            cost: cost,
            efficiency: efficiency
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit EnergyRecorded(recordId, msg.sender, energySource, consumption);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (EnergyRecord memory) {
        return records[recordId];
    }
}
