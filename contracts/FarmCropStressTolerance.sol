// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropStressTolerance
 * @dev Onchain crop stress tolerance monitoring and adaptation tracking
 */
contract FarmCropStressTolerance is Ownable {
    struct StressTolerance {
        uint256 recordId;
        address farmer;
        string cropVariety;
        string stressType;
        uint256 toleranceLevel;
        uint256 adaptationScore;
        uint256 recordDate;
        string adaptationMeasures;
    }

    mapping(uint256 => StressTolerance) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event ToleranceRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string cropVariety,
        uint256 toleranceLevel
    );

    constructor() Ownable(msg.sender) {}

    function recordTolerance(
        string memory cropVariety,
        string memory stressType,
        uint256 toleranceLevel,
        uint256 adaptationScore,
        string memory adaptationMeasures
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = StressTolerance({
            recordId: recordId,
            farmer: msg.sender,
            cropVariety: cropVariety,
            stressType: stressType,
            toleranceLevel: toleranceLevel,
            adaptationScore: adaptationScore,
            recordDate: block.timestamp,
            adaptationMeasures: adaptationMeasures
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit ToleranceRecorded(recordId, msg.sender, cropVariety, toleranceLevel);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (StressTolerance memory) {
        return records[recordId];
    }
}
