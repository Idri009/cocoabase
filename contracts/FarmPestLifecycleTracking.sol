// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmPestLifecycleTracking
 * @dev Onchain pest lifecycle tracking and population dynamics
 */
contract FarmPestLifecycleTracking is Ownable {
    struct LifecycleRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        string pestType;
        string lifecycleStage;
        uint256 populationCount;
        uint256 recordDate;
        string controlMeasures;
    }

    mapping(uint256 => LifecycleRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event LifecycleRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        string pestType,
        string lifecycleStage
    );

    constructor() Ownable(msg.sender) {}

    function recordLifecycle(
        string memory fieldId,
        string memory pestType,
        string memory lifecycleStage,
        uint256 populationCount,
        string memory controlMeasures
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = LifecycleRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            pestType: pestType,
            lifecycleStage: lifecycleStage,
            populationCount: populationCount,
            recordDate: block.timestamp,
            controlMeasures: controlMeasures
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit LifecycleRecorded(recordId, msg.sender, fieldId, pestType, lifecycleStage);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (LifecycleRecord memory) {
        return records[recordId];
    }
}
