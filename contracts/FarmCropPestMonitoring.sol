// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropPestMonitoring
 * @dev Onchain pest monitoring and early warning system
 */
contract FarmCropPestMonitoring is Ownable {
    struct PestObservation {
        uint256 observationId;
        address farmer;
        string fieldId;
        string pestType;
        uint256 severity;
        uint256 observationDate;
        string treatment;
    }

    mapping(uint256 => PestObservation) public observations;
    mapping(address => uint256[]) public observationsByFarmer;
    uint256 private _observationIdCounter;

    event PestObserved(
        uint256 indexed observationId,
        address indexed farmer,
        string pestType,
        uint256 severity
    );

    constructor() Ownable(msg.sender) {}

    function recordObservation(
        string memory fieldId,
        string memory pestType,
        uint256 severity,
        string memory treatment
    ) public returns (uint256) {
        uint256 observationId = _observationIdCounter++;
        observations[observationId] = PestObservation({
            observationId: observationId,
            farmer: msg.sender,
            fieldId: fieldId,
            pestType: pestType,
            severity: severity,
            observationDate: block.timestamp,
            treatment: treatment
        });

        observationsByFarmer[msg.sender].push(observationId);
        emit PestObserved(observationId, msg.sender, pestType, severity);
        return observationId;
    }

    function getObservation(uint256 observationId) public view returns (PestObservation memory) {
        return observations[observationId];
    }
}

