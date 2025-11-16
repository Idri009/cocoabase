// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropPollinationSuccessTracking
 * @dev Onchain pollination success rates and fruit set tracking
 */
contract FarmCropPollinationSuccessTracking is Ownable {
    struct PollinationSuccess {
        uint256 recordId;
        address farmer;
        string fieldId;
        uint256 flowersPollinated;
        uint256 fruitSet;
        uint256 successRate;
        uint256 recordDate;
        string pollinatorType;
    }

    mapping(uint256 => PollinationSuccess) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event SuccessRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        uint256 successRate
    );

    constructor() Ownable(msg.sender) {}

    function recordSuccess(
        string memory fieldId,
        uint256 flowersPollinated,
        uint256 fruitSet,
        string memory pollinatorType
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        uint256 successRate = (fruitSet * 100) / flowersPollinated;

        records[recordId] = PollinationSuccess({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            flowersPollinated: flowersPollinated,
            fruitSet: fruitSet,
            successRate: successRate,
            recordDate: block.timestamp,
            pollinatorType: pollinatorType
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit SuccessRecorded(recordId, msg.sender, fieldId, successRate);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (PollinationSuccess memory) {
        return records[recordId];
    }
}

