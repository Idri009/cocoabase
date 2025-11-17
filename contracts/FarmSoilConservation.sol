// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilConservation
 * @dev Soil conservation practices tracking
 */
contract FarmSoilConservation is Ownable {
    struct Conservation {
        uint256 conservationId;
        address farmer;
        uint256 fieldId;
        string practice;
        uint256 effectiveness;
        uint256 timestamp;
    }

    mapping(uint256 => Conservation) public conservations;
    mapping(address => uint256[]) public conservationsByFarmer;
    uint256 private _conservationIdCounter;

    event ConservationRecorded(uint256 indexed conservationId, string practice);

    constructor() Ownable(msg.sender) {}

    function recordConservation(
        uint256 fieldId,
        string memory practice,
        uint256 effectiveness
    ) public returns (uint256) {
        uint256 conservationId = _conservationIdCounter++;
        conservations[conservationId] = Conservation({
            conservationId: conservationId,
            farmer: msg.sender,
            fieldId: fieldId,
            practice: practice,
            effectiveness: effectiveness,
            timestamp: block.timestamp
        });
        conservationsByFarmer[msg.sender].push(conservationId);
        emit ConservationRecorded(conservationId, practice);
        return conservationId;
    }
}

