// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWaterRecycling
 * @dev Onchain water recycling and reuse tracking system
 */
contract FarmWaterRecycling is Ownable {
    struct RecyclingRecord {
        uint256 recordId;
        address farmer;
        string sourceType;
        uint256 waterRecycled;
        string treatmentMethod;
        uint256 recordDate;
        uint256 reuseEfficiency;
        string reusePurpose;
    }

    mapping(uint256 => RecyclingRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event RecyclingRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string sourceType,
        uint256 waterRecycled
    );

    constructor() Ownable(msg.sender) {}

    function recordRecycling(
        string memory sourceType,
        uint256 waterRecycled,
        string memory treatmentMethod,
        uint256 reuseEfficiency,
        string memory reusePurpose
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = RecyclingRecord({
            recordId: recordId,
            farmer: msg.sender,
            sourceType: sourceType,
            waterRecycled: waterRecycled,
            treatmentMethod: treatmentMethod,
            recordDate: block.timestamp,
            reuseEfficiency: reuseEfficiency,
            reusePurpose: reusePurpose
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit RecyclingRecorded(recordId, msg.sender, sourceType, waterRecycled);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (RecyclingRecord memory) {
        return records[recordId];
    }
}
