// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmPrecisionFarming
 * @dev Precision farming data collection and optimization recommendations
 */
contract FarmPrecisionFarming is Ownable {
    struct PrecisionData {
        uint256 dataId;
        address farmer;
        string fieldId;
        int256 gpsLatitude;
        int256 gpsLongitude;
        uint256 soilMoisture;
        uint256 nutrientLevel;
        uint256 cropHealth;
        uint256 timestamp;
    }

    mapping(uint256 => PrecisionData) public dataPoints;
    mapping(address => uint256[]) public dataByFarmer;
    uint256 private _dataIdCounter;

    event DataRecorded(
        uint256 indexed dataId,
        address indexed farmer,
        string fieldId
    );

    constructor() Ownable(msg.sender) {}

    function recordPrecisionData(
        string memory fieldId,
        int256 gpsLatitude,
        int256 gpsLongitude,
        uint256 soilMoisture,
        uint256 nutrientLevel,
        uint256 cropHealth
    ) public returns (uint256) {
        uint256 dataId = _dataIdCounter++;
        dataPoints[dataId] = PrecisionData({
            dataId: dataId,
            farmer: msg.sender,
            fieldId: fieldId,
            gpsLatitude: gpsLatitude,
            gpsLongitude: gpsLongitude,
            soilMoisture: soilMoisture,
            nutrientLevel: nutrientLevel,
            cropHealth: cropHealth,
            timestamp: block.timestamp
        });

        dataByFarmer[msg.sender].push(dataId);
        emit DataRecorded(dataId, msg.sender, fieldId);
        return dataId;
    }

    function getDataPoint(uint256 dataId) public view returns (PrecisionData memory) {
        return dataPoints[dataId];
    }
}
