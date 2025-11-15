// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmDroneMonitoring
 * @dev Onchain recording of drone monitoring flights and aerial imagery metadata
 */
contract FarmDroneMonitoring is Ownable {
    struct DroneFlight {
        uint256 flightId;
        address operator;
        string fieldId;
        uint256 flightDate;
        string imageryHash;
        uint256 altitude;
        uint256 areaCovered;
        string findings;
    }

    mapping(uint256 => DroneFlight) public flights;
    mapping(address => uint256[]) public flightsByOperator;
    uint256 private _flightIdCounter;

    event FlightRecorded(
        uint256 indexed flightId,
        address indexed operator,
        string fieldId
    );

    constructor() Ownable(msg.sender) {}

    function recordFlight(
        string memory fieldId,
        string memory imageryHash,
        uint256 altitude,
        uint256 areaCovered,
        string memory findings
    ) public returns (uint256) {
        uint256 flightId = _flightIdCounter++;
        flights[flightId] = DroneFlight({
            flightId: flightId,
            operator: msg.sender,
            fieldId: fieldId,
            flightDate: block.timestamp,
            imageryHash: imageryHash,
            altitude: altitude,
            areaCovered: areaCovered,
            findings: findings
        });

        flightsByOperator[msg.sender].push(flightId);
        emit FlightRecorded(flightId, msg.sender, fieldId);
        return flightId;
    }

    function getFlight(uint256 flightId) public view returns (DroneFlight memory) {
        return flights[flightId];
    }
}
