// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockReproductionSuccess
 * @dev Reproduction success rate tracking and analysis
 */
contract FarmLivestockReproductionSuccess is Ownable {
    struct ReproductionRecord {
        uint256 recordId;
        address farmer;
        string livestockId;
        bool successful;
        uint256 offspringCount;
        uint256 recordDate;
    }

    mapping(uint256 => ReproductionRecord) public records;
    uint256 private _recordIdCounter;

    event RecordCreated(
        uint256 indexed recordId,
        address indexed farmer,
        bool successful
    );

    constructor() Ownable(msg.sender) {}

    function recordReproduction(
        string memory livestockId,
        bool successful,
        uint256 offspringCount
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = ReproductionRecord({
            recordId: recordId,
            farmer: msg.sender,
            livestockId: livestockId,
            successful: successful,
            offspringCount: offspringCount,
            recordDate: block.timestamp
        });

        emit RecordCreated(recordId, msg.sender, successful);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (ReproductionRecord memory) {
        return records[recordId];
    }
}
