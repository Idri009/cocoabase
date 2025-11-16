// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmPestLifecycleTracking
 * @dev Track pest lifecycles and population dynamics
 */
contract FarmPestLifecycleTracking is Ownable {
    struct LifecycleRecord {
        uint256 recordId;
        address farmer;
        string pestType;
        string lifecycleStage;
        uint256 populationCount;
        uint256 observationDate;
    }

    mapping(uint256 => LifecycleRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event RecordCreated(
        uint256 indexed recordId,
        address indexed farmer,
        string pestType
    );

    constructor() Ownable(msg.sender) {}

    function createRecord(
        string memory pestType,
        string memory lifecycleStage,
        uint256 populationCount
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = LifecycleRecord({
            recordId: recordId,
            farmer: msg.sender,
            pestType: pestType,
            lifecycleStage: lifecycleStage,
            populationCount: populationCount,
            observationDate: block.timestamp
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit RecordCreated(recordId, msg.sender, pestType);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (LifecycleRecord memory) {
        return records[recordId];
    }
}
