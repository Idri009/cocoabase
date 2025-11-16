// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmDroneMonitoring
 * @dev Store drone monitoring data and aerial analysis
 */
contract FarmDroneMonitoring is Ownable {
    struct DroneData {
        uint256 flightId;
        address operator;
        uint256 fieldId;
        bytes32 imageHash;
        string analysis;
        uint256 timestamp;
    }

    mapping(uint256 => DroneData) public droneFlights;
    mapping(address => uint256[]) public flightsByOperator;
    mapping(uint256 => uint256[]) public flightsByField;
    uint256 private _flightIdCounter;

    event DroneFlightRecorded(
        uint256 indexed flightId,
        address indexed operator,
        uint256 fieldId
    );

    constructor() Ownable(msg.sender) {}

    function recordFlight(
        uint256 fieldId,
        bytes32 imageHash,
        string memory analysis
    ) public returns (uint256) {
        uint256 flightId = _flightIdCounter++;
        droneFlights[flightId] = DroneData({
            flightId: flightId,
            operator: msg.sender,
            fieldId: fieldId,
            imageHash: imageHash,
            analysis: analysis,
            timestamp: block.timestamp
        });
        flightsByOperator[msg.sender].push(flightId);
        flightsByField[fieldId].push(flightId);
        emit DroneFlightRecorded(flightId, msg.sender, fieldId);
        return flightId;
    }

    function getFieldFlights(uint256 fieldId) public view returns (uint256[] memory) {
        return flightsByField[fieldId];
    }
}
