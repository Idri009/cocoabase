// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWildlifeConservation
 * @dev Onchain system for tracking wildlife conservation efforts on farms
 */
contract FarmWildlifeConservation is Ownable {
    struct ConservationEffort {
        uint256 effortId;
        uint256 farmId;
        string speciesType;
        uint256 habitatArea;
        string conservationMethod;
        uint256 recordDate;
        address recorder;
    }

    mapping(uint256 => ConservationEffort) public conservationEfforts;
    mapping(address => uint256[]) public effortsByRecorder;
    uint256 private _effortIdCounter;

    event ConservationEffortRecorded(
        uint256 indexed effortId,
        address indexed recorder,
        string speciesType
    );

    constructor() Ownable(msg.sender) {}

    function recordConservationEffort(
        uint256 farmId,
        string memory speciesType,
        uint256 habitatArea,
        string memory conservationMethod,
        uint256 recordDate
    ) public returns (uint256) {
        uint256 effortId = _effortIdCounter++;
        conservationEfforts[effortId] = ConservationEffort({
            effortId: effortId,
            farmId: farmId,
            speciesType: speciesType,
            habitatArea: habitatArea,
            conservationMethod: conservationMethod,
            recordDate: recordDate,
            recorder: msg.sender
        });

        effortsByRecorder[msg.sender].push(effortId);

        emit ConservationEffortRecorded(effortId, msg.sender, speciesType);
        return effortId;
    }

    function getEffort(uint256 effortId) public view returns (ConservationEffort memory) {
        return conservationEfforts[effortId];
    }
}


