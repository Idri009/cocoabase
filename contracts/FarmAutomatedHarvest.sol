// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmAutomatedHarvest
 * @dev Automated harvest trigger based on onchain conditions
 */
contract FarmAutomatedHarvest is Ownable {
    struct HarvestTrigger {
        uint256 triggerId;
        uint256 plantationId;
        uint256 maturityThreshold;
        uint256 moistureThreshold;
        bool triggered;
    }

    mapping(uint256 => HarvestTrigger) public triggers;
    mapping(uint256 => uint256) public plantationMaturity;
    mapping(uint256 => uint256) public plantationMoisture;
    uint256 private _triggerIdCounter;

    event TriggerCreated(uint256 indexed triggerId, uint256 indexed plantationId);
    event HarvestTriggered(uint256 indexed triggerId, uint256 maturity, uint256 moisture);

    constructor() Ownable(msg.sender) {}

    function createTrigger(
        uint256 plantationId,
        uint256 maturityThreshold,
        uint256 moistureThreshold
    ) public returns (uint256) {
        uint256 triggerId = _triggerIdCounter++;
        triggers[triggerId] = HarvestTrigger({
            triggerId: triggerId,
            plantationId: plantationId,
            maturityThreshold: maturityThreshold,
            moistureThreshold: moistureThreshold,
            triggered: false
        });
        emit TriggerCreated(triggerId, plantationId);
        return triggerId;
    }

    function updatePlantationData(
        uint256 plantationId,
        uint256 maturity,
        uint256 moisture
    ) public {
        plantationMaturity[plantationId] = maturity;
        plantationMoisture[plantationId] = moisture;
        
        for (uint256 i = 0; i < _triggerIdCounter; i++) {
            HarvestTrigger storage trigger = triggers[i];
            if (trigger.plantationId == plantationId && 
                !trigger.triggered &&
                maturity >= trigger.maturityThreshold &&
                moisture <= trigger.moistureThreshold) {
                trigger.triggered = true;
                emit HarvestTriggered(i, maturity, moisture);
            }
        }
    }

    function checkTrigger(uint256 triggerId) public view returns (bool) {
        HarvestTrigger memory trigger = triggers[triggerId];
        return plantationMaturity[trigger.plantationId] >= trigger.maturityThreshold &&
               plantationMoisture[trigger.plantationId] <= trigger.moistureThreshold;
    }
}

