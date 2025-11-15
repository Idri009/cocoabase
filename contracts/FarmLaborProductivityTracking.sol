// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLaborProductivityTracking
 * @dev Labor productivity metrics and performance tracking
 */
contract FarmLaborProductivityTracking is Ownable {
    struct ProductivityRecord {
        uint256 recordId;
        address worker;
        string taskType;
        uint256 hoursWorked;
        uint256 outputAchieved;
        uint256 productivityScore;
        uint256 timestamp;
    }

    mapping(uint256 => ProductivityRecord) public records;
    mapping(address => uint256[]) public recordsByWorker;
    uint256 private _recordIdCounter;

    event ProductivityRecorded(
        uint256 indexed recordId,
        address indexed worker,
        uint256 productivityScore
    );

    constructor() Ownable(msg.sender) {}

    function recordProductivity(
        address worker,
        string memory taskType,
        uint256 hoursWorked,
        uint256 outputAchieved
    ) public returns (uint256) {
        uint256 productivityScore = (outputAchieved * 10000) / hoursWorked;
        uint256 recordId = _recordIdCounter++;
        records[recordId] = ProductivityRecord({
            recordId: recordId,
            worker: worker,
            taskType: taskType,
            hoursWorked: hoursWorked,
            outputAchieved: outputAchieved,
            productivityScore: productivityScore,
            timestamp: block.timestamp
        });

        recordsByWorker[worker].push(recordId);
        emit ProductivityRecorded(recordId, worker, productivityScore);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (ProductivityRecord memory) {
        return records[recordId];
    }
}
