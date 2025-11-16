// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropFloweringTracking
 * @dev Onchain flowering stages and timing monitoring
 */
contract FarmCropFloweringTracking is Ownable {
    struct FloweringRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        string cropType;
        uint256 floweringStartDate;
        uint256 peakFloweringDate;
        uint256 floweringEndDate;
        uint256 bloomCount;
        string pollinatorActivity;
    }

    mapping(uint256 => FloweringRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event FloweringRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        uint256 bloomCount
    );

    constructor() Ownable(msg.sender) {}

    function recordFlowering(
        string memory fieldId,
        string memory cropType,
        uint256 floweringStartDate,
        uint256 peakFloweringDate,
        uint256 bloomCount,
        string memory pollinatorActivity
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = FloweringRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            cropType: cropType,
            floweringStartDate: floweringStartDate,
            peakFloweringDate: peakFloweringDate,
            floweringEndDate: 0,
            bloomCount: bloomCount,
            pollinatorActivity: pollinatorActivity
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit FloweringRecorded(recordId, msg.sender, fieldId, bloomCount);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (FloweringRecord memory) {
        return records[recordId];
    }
}
