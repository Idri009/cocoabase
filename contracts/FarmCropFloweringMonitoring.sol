// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropFloweringMonitoring
 * @dev Monitor flowering stages and timing for crops
 */
contract FarmCropFloweringMonitoring is Ownable {
    struct FloweringRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        string cropType;
        uint256 floweringPercentage;
        uint256 peakDate;
        uint256 recordDate;
    }

    mapping(uint256 => FloweringRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event FloweringRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        uint256 floweringPercentage
    );

    constructor() Ownable(msg.sender) {}

    function recordFlowering(
        string memory fieldId,
        string memory cropType,
        uint256 floweringPercentage,
        uint256 peakDate
    ) public returns (uint256) {
        require(floweringPercentage <= 100, "Invalid percentage");
        uint256 recordId = _recordIdCounter++;
        records[recordId] = FloweringRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            cropType: cropType,
            floweringPercentage: floweringPercentage,
            peakDate: peakDate,
            recordDate: block.timestamp
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit FloweringRecorded(recordId, msg.sender, floweringPercentage);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (FloweringRecord memory) {
        return records[recordId];
    }
}
