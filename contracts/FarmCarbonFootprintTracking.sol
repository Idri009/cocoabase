// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCarbonFootprintTracking
 * @dev Carbon footprint calculation and tracking
 */
contract FarmCarbonFootprintTracking is Ownable {
    struct CarbonFootprint {
        uint256 footprintId;
        address farmer;
        uint256 farmId;
        uint256 totalEmissions;
        uint256 offsetAmount;
        uint256 netEmissions;
        uint256 timestamp;
    }

    mapping(uint256 => CarbonFootprint) public footprints;
    mapping(address => uint256[]) public footprintsByFarmer;
    mapping(uint256 => uint256) public totalEmissionsByFarm;
    uint256 private _footprintIdCounter;

    event FootprintCalculated(
        uint256 indexed footprintId,
        address indexed farmer,
        uint256 netEmissions
    );

    constructor() Ownable(msg.sender) {}

    function calculateFootprint(
        uint256 farmId,
        uint256 totalEmissions,
        uint256 offsetAmount
    ) public returns (uint256) {
        uint256 netEmissions = totalEmissions > offsetAmount 
            ? totalEmissions - offsetAmount 
            : 0;
        uint256 footprintId = _footprintIdCounter++;
        footprints[footprintId] = CarbonFootprint({
            footprintId: footprintId,
            farmer: msg.sender,
            farmId: farmId,
            totalEmissions: totalEmissions,
            offsetAmount: offsetAmount,
            netEmissions: netEmissions,
            timestamp: block.timestamp
        });
        footprintsByFarmer[msg.sender].push(footprintId);
        totalEmissionsByFarm[farmId] += totalEmissions;
        emit FootprintCalculated(footprintId, msg.sender, netEmissions);
        return footprintId;
    }

    function getTotalEmissions(uint256 farmId) public view returns (uint256) {
        return totalEmissionsByFarm[farmId];
    }
}
