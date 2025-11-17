// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmIrrigationAutomation
 * @dev Automated irrigation control and monitoring
 */
contract FarmIrrigationAutomation is Ownable {
    struct IrrigationZone {
        uint256 zoneId;
        address farmer;
        string fieldId;
        bool automated;
        uint256 lastIrrigation;
        uint256 moistureThreshold;
    }

    mapping(uint256 => IrrigationZone) public zones;
    mapping(address => uint256[]) public zonesByFarmer;
    uint256 private _zoneIdCounter;

    event ZoneConfigured(
        uint256 indexed zoneId,
        address indexed farmer,
        bool automated
    );

    event IrrigationTriggered(
        uint256 indexed zoneId,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    function configureZone(
        string memory fieldId,
        bool automated,
        uint256 moistureThreshold
    ) public returns (uint256) {
        uint256 zoneId = _zoneIdCounter++;
        zones[zoneId] = IrrigationZone({
            zoneId: zoneId,
            farmer: msg.sender,
            fieldId: fieldId,
            automated: automated,
            lastIrrigation: 0,
            moistureThreshold: moistureThreshold
        });

        zonesByFarmer[msg.sender].push(zoneId);
        emit ZoneConfigured(zoneId, msg.sender, automated);
        return zoneId;
    }

    function triggerIrrigation(uint256 zoneId) public {
        require(zones[zoneId].farmer == msg.sender, "Not authorized");
        zones[zoneId].lastIrrigation = block.timestamp;
        emit IrrigationTriggered(zoneId, block.timestamp);
    }

    function getZone(uint256 zoneId) public view returns (IrrigationZone memory) {
        return zones[zoneId];
    }
}
