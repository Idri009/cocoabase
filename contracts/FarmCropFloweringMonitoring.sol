// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropFloweringMonitoring
 * @dev Onchain flowering stages and timing monitoring for crops
 */
contract FarmCropFloweringMonitoring is Ownable {
    struct FloweringMonitor {
        uint256 monitorId;
        address farmer;
        string fieldId;
        string cropType;
        uint256 floweringStart;
        uint256 peakFlowering;
        uint256 floweringEnd;
        uint256 bloomDensity;
        uint256 recordDate;
    }

    mapping(uint256 => FloweringMonitor) public monitors;
    mapping(address => uint256[]) public monitorsByFarmer;
    uint256 private _monitorIdCounter;

    event FloweringMonitored(
        uint256 indexed monitorId,
        address indexed farmer,
        string fieldId,
        uint256 bloomDensity
    );

    constructor() Ownable(msg.sender) {}

    function monitorFlowering(
        string memory fieldId,
        string memory cropType,
        uint256 floweringStart,
        uint256 peakFlowering,
        uint256 bloomDensity
    ) public returns (uint256) {
        uint256 monitorId = _monitorIdCounter++;
        monitors[monitorId] = FloweringMonitor({
            monitorId: monitorId,
            farmer: msg.sender,
            fieldId: fieldId,
            cropType: cropType,
            floweringStart: floweringStart,
            peakFlowering: peakFlowering,
            floweringEnd: 0,
            bloomDensity: bloomDensity,
            recordDate: block.timestamp
        });

        monitorsByFarmer[msg.sender].push(monitorId);
        emit FloweringMonitored(monitorId, msg.sender, fieldId, bloomDensity);
        return monitorId;
    }

    function getMonitor(uint256 monitorId) public view returns (FloweringMonitor memory) {
        return monitors[monitorId];
    }
}
