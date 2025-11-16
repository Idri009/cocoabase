// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropGrowthStageMonitoring
 * @dev Onchain crop growth stage monitoring and progression tracking
 */
contract FarmCropGrowthStageMonitoring is Ownable {
    struct GrowthStage {
        uint256 stageId;
        address farmer;
        string fieldId;
        string currentStage;
        uint256 stageStartDate;
        uint256 expectedDuration;
        string conditions;
    }

    mapping(uint256 => GrowthStage) public stages;
    mapping(address => uint256[]) public stagesByFarmer;
    uint256 private _stageIdCounter;

    event StageRecorded(
        uint256 indexed stageId,
        address indexed farmer,
        string fieldId,
        string currentStage
    );

    constructor() Ownable(msg.sender) {}

    function recordStage(
        string memory fieldId,
        string memory currentStage,
        uint256 stageStartDate,
        uint256 expectedDuration,
        string memory conditions
    ) public returns (uint256) {
        uint256 stageId = _stageIdCounter++;
        stages[stageId] = GrowthStage({
            stageId: stageId,
            farmer: msg.sender,
            fieldId: fieldId,
            currentStage: currentStage,
            stageStartDate: stageStartDate,
            expectedDuration: expectedDuration,
            conditions: conditions
        });

        stagesByFarmer[msg.sender].push(stageId);
        emit StageRecorded(stageId, msg.sender, fieldId, currentStage);
        return stageId;
    }

    function getStage(uint256 stageId) public view returns (GrowthStage memory) {
        return stages[stageId];
    }
}

