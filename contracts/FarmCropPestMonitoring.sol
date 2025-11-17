// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropPestMonitoring
 * @dev Pest monitoring and early warning system
 */
contract FarmCropPestMonitoring is Ownable {
    struct PestObservation {
        uint256 observationId;
        address farmer;
        string fieldId;
        string pestType;
        uint256 populationLevel;
        uint256 observationDate;
        bool actionRequired;
    }

    mapping(uint256 => PestObservation) public observations;
    mapping(address => uint256[]) public observationsByFarmer;
    uint256 private _observationIdCounter;

    event ObservationRecorded(
        uint256 indexed observationId,
        address indexed farmer,
        string pestType
    );

    constructor() Ownable(msg.sender) {}

    function recordObservation(
        string memory fieldId,
        string memory pestType,
        uint256 populationLevel
    ) public returns (uint256) {
        bool actionRequired = populationLevel > 50;
        uint256 observationId = _observationIdCounter++;
        observations[observationId] = PestObservation({
            observationId: observationId,
            farmer: msg.sender,
            fieldId: fieldId,
            pestType: pestType,
            populationLevel: populationLevel,
            observationDate: block.timestamp,
            actionRequired: actionRequired
        });

        observationsByFarmer[msg.sender].push(observationId);
        emit ObservationRecorded(observationId, msg.sender, pestType);
        return observationId;
    }

    function getObservation(uint256 observationId) public view returns (PestObservation memory) {
        return observations[observationId];
    }
}