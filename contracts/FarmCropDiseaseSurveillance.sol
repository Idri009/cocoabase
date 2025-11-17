// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropDiseaseSurveillance
 * @dev Disease surveillance and monitoring system
 */
contract FarmCropDiseaseSurveillance is Ownable {
    struct Surveillance {
        uint256 surveillanceId;
        address monitor;
        uint256 fieldId;
        string diseaseType;
        uint256 severity;
        bool detected;
        uint256 timestamp;
    }

    mapping(uint256 => Surveillance) public surveillances;
    mapping(address => uint256[]) public surveillancesByMonitor;
    uint256 private _surveillanceIdCounter;

    event DiseaseDetected(uint256 indexed surveillanceId, string diseaseType);

    constructor() Ownable(msg.sender) {}

    function recordSurveillance(
        uint256 fieldId,
        string memory diseaseType,
        uint256 severity
    ) public returns (uint256) {
        bool detected = severity > 0;
        uint256 surveillanceId = _surveillanceIdCounter++;
        surveillances[surveillanceId] = Surveillance({
            surveillanceId: surveillanceId,
            monitor: msg.sender,
            fieldId: fieldId,
            diseaseType: diseaseType,
            severity: severity,
            detected: detected,
            timestamp: block.timestamp
        });
        surveillancesByMonitor[msg.sender].push(surveillanceId);
        if (detected) {
            emit DiseaseDetected(surveillanceId, diseaseType);
        }
        return surveillanceId;
    }
}

