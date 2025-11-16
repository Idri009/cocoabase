// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmEquipmentFuelTracking
 * @dev Onchain equipment fuel consumption and efficiency tracking
 */
contract FarmEquipmentFuelTracking is Ownable {
    struct FuelRecord {
        uint256 recordId;
        address farmer;
        string equipmentId;
        uint256 fuelConsumed;
        uint256 hoursOperated;
        uint256 fuelEfficiency;
        uint256 recordDate;
        string fuelType;
    }

    mapping(uint256 => FuelRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event FuelRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string equipmentId,
        uint256 fuelEfficiency
    );

    constructor() Ownable(msg.sender) {}

    function recordFuel(
        string memory equipmentId,
        uint256 fuelConsumed,
        uint256 hoursOperated,
        string memory fuelType
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        uint256 fuelEfficiency = (hoursOperated * 100) / fuelConsumed;

        records[recordId] = FuelRecord({
            recordId: recordId,
            farmer: msg.sender,
            equipmentId: equipmentId,
            fuelConsumed: fuelConsumed,
            hoursOperated: hoursOperated,
            fuelEfficiency: fuelEfficiency,
            recordDate: block.timestamp,
            fuelType: fuelType
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit FuelRecorded(recordId, msg.sender, equipmentId, fuelEfficiency);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (FuelRecord memory) {
        return records[recordId];
    }
}
