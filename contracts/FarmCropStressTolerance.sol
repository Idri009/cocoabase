// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropStressTolerance
 * @dev Monitor crop stress tolerance levels and adaptation
 */
contract FarmCropStressTolerance is Ownable {
    struct StressTolerance {
        uint256 recordId;
        address farmer;
        string cropType;
        string stressType;
        uint256 toleranceLevel;
        uint256 recordDate;
    }

    mapping(uint256 => StressTolerance) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event ToleranceRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string stressType
    );

    constructor() Ownable(msg.sender) {}

    function recordTolerance(
        string memory cropType,
        string memory stressType,
        uint256 toleranceLevel
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = StressTolerance({
            recordId: recordId,
            farmer: msg.sender,
            cropType: cropType,
            stressType: stressType,
            toleranceLevel: toleranceLevel,
            recordDate: block.timestamp
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit ToleranceRecorded(recordId, msg.sender, stressType);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (StressTolerance memory) {
        return records[recordId];
    }
}
