// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockMilkingRecords
 * @dev Onchain milking records and production tracking
 */
contract FarmLivestockMilkingRecords is Ownable {
    struct MilkingRecord {
        uint256 recordId;
        address farmer;
        string livestockId;
        uint256 milkVolume;
        uint256 milkingDate;
        string quality;
        uint256 fatContent;
    }

    mapping(uint256 => MilkingRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    mapping(string => uint256[]) public recordsByLivestock;
    uint256 private _recordIdCounter;

    event MilkingRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string livestockId,
        uint256 milkVolume
    );

    constructor() Ownable(msg.sender) {}

    function recordMilking(
        string memory livestockId,
        uint256 milkVolume,
        string memory quality,
        uint256 fatContent
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = MilkingRecord({
            recordId: recordId,
            farmer: msg.sender,
            livestockId: livestockId,
            milkVolume: milkVolume,
            milkingDate: block.timestamp,
            quality: quality,
            fatContent: fatContent
        });

        recordsByFarmer[msg.sender].push(recordId);
        recordsByLivestock[livestockId].push(recordId);

        emit MilkingRecorded(recordId, msg.sender, livestockId, milkVolume);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (MilkingRecord memory) {
        return records[recordId];
    }
}

