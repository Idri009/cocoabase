// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockProductivityMetrics
 * @dev Onchain productivity metrics and performance tracking
 */
contract FarmLivestockProductivityMetrics is Ownable {
    struct ProductivityMetric {
        uint256 metricId;
        address farmer;
        string livestockId;
        string metricType;
        uint256 value;
        uint256 measurementDate;
        string unit;
    }

    mapping(uint256 => ProductivityMetric) public metrics;
    mapping(address => uint256[]) public metricsByFarmer;
    uint256 private _metricIdCounter;

    event MetricRecorded(
        uint256 indexed metricId,
        address indexed farmer,
        string livestockId,
        string metricType
    );

    constructor() Ownable(msg.sender) {}

    function recordMetric(
        string memory livestockId,
        string memory metricType,
        uint256 value,
        string memory unit
    ) public returns (uint256) {
        uint256 metricId = _metricIdCounter++;
        metrics[metricId] = ProductivityMetric({
            metricId: metricId,
            farmer: msg.sender,
            livestockId: livestockId,
            metricType: metricType,
            value: value,
            measurementDate: block.timestamp,
            unit: unit
        });

        metricsByFarmer[msg.sender].push(metricId);
        emit MetricRecorded(metricId, msg.sender, livestockId, metricType);
        return metricId;
    }

    function getMetric(uint256 metricId) public view returns (ProductivityMetric memory) {
        return metrics[metricId];
    }
}

