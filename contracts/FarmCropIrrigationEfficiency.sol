// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropIrrigationEfficiency
 * @dev Onchain irrigation efficiency tracking and optimization
 */
contract FarmCropIrrigationEfficiency is Ownable {
    struct IrrigationRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        uint256 waterUsed;
        uint256 cropYield;
        uint256 efficiencyScore;
        uint256 timestamp;
    }

    mapping(uint256 => IrrigationRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event EfficiencyRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        uint256 efficiencyScore
    );

    constructor() Ownable(msg.sender) {}

    function recordIrrigation(
        string memory fieldId,
        uint256 waterUsed,
        uint256 cropYield
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        uint256 efficiencyScore = (cropYield * 100) / waterUsed;

        records[recordId] = IrrigationRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            waterUsed: waterUsed,
            cropYield: cropYield,
            efficiencyScore: efficiencyScore,
            timestamp: block.timestamp
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit EfficiencyRecorded(recordId, msg.sender, efficiencyScore);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (IrrigationRecord memory) {
        return records[recordId];
    }
}

