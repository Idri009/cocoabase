// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropPollinationSuccess
 * @dev Track pollination success rates and fruit set
 */
contract FarmCropPollinationSuccess is Ownable {
    struct PollinationRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        string cropType;
        uint256 flowersPollinated;
        uint256 fruitSet;
        uint256 successRate;
        uint256 recordDate;
    }

    mapping(uint256 => PollinationRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event PollinationRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        uint256 successRate
    );

    constructor() Ownable(msg.sender) {}

    function recordPollination(
        string memory fieldId,
        string memory cropType,
        uint256 flowersPollinated,
        uint256 fruitSet
    ) public returns (uint256) {
        require(flowersPollinated > 0, "Invalid count");
        uint256 successRate = (fruitSet * 10000) / flowersPollinated;
        uint256 recordId = _recordIdCounter++;
        records[recordId] = PollinationRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            cropType: cropType,
            flowersPollinated: flowersPollinated,
            fruitSet: fruitSet,
            successRate: successRate,
            recordDate: block.timestamp
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit PollinationRecorded(recordId, msg.sender, successRate);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (PollinationRecord memory) {
        return records[recordId];
    }
}
