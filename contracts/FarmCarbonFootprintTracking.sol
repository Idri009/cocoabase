// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCarbonFootprintTracking
 * @dev Onchain carbon footprint calculation and tracking
 */
contract FarmCarbonFootprintTracking is Ownable {
    struct CarbonFootprint {
        uint256 footprintId;
        address farmer;
        string activityType;
        uint256 emissions;
        string unit;
        uint256 timestamp;
        string offsetMethod;
    }

    mapping(uint256 => CarbonFootprint) public footprints;
    mapping(address => uint256[]) public footprintsByFarmer;
    mapping(address => uint256) public totalEmissionsByFarmer;
    uint256 private _footprintIdCounter;

    event CarbonFootprintRecorded(
        uint256 indexed footprintId,
        address indexed farmer,
        string activityType,
        uint256 emissions
    );

    constructor() Ownable(msg.sender) {}

    function recordFootprint(
        string memory activityType,
        uint256 emissions,
        string memory unit,
        string memory offsetMethod
    ) public returns (uint256) {
        require(emissions > 0, "Emissions must be greater than 0");

        uint256 footprintId = _footprintIdCounter++;
        footprints[footprintId] = CarbonFootprint({
            footprintId: footprintId,
            farmer: msg.sender,
            activityType: activityType,
            emissions: emissions,
            unit: unit,
            timestamp: block.timestamp,
            offsetMethod: offsetMethod
        });

        footprintsByFarmer[msg.sender].push(footprintId);
        totalEmissionsByFarmer[msg.sender] += emissions;

        emit CarbonFootprintRecorded(footprintId, msg.sender, activityType, emissions);
        return footprintId;
    }

    function getFootprint(uint256 footprintId) public view returns (CarbonFootprint memory) {
        return footprints[footprintId];
    }

    function getTotalEmissions(address farmer) public view returns (uint256) {
        return totalEmissionsByFarmer[farmer];
    }
}
