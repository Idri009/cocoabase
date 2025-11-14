// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockBreeding
 * @dev Onchain system for tracking livestock breeding records
 */
contract FarmLivestockBreeding is Ownable {
    struct BreedingRecord {
        uint256 recordId;
        uint256 sireId;
        uint256 damId;
        uint256 breedingDate;
        address breeder;
        bool successful;
        uint256 offspringId;
    }

    mapping(uint256 => BreedingRecord) public breedingRecords;
    mapping(address => uint256[]) public recordsByBreeder;
    uint256 private _recordIdCounter;

    event BreedingRecorded(
        uint256 indexed recordId,
        address indexed breeder,
        uint256 sireId,
        uint256 damId
    );

    constructor() Ownable(msg.sender) {}

    function recordBreeding(
        uint256 sireId,
        uint256 damId
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        breedingRecords[recordId] = BreedingRecord({
            recordId: recordId,
            sireId: sireId,
            damId: damId,
            breedingDate: block.timestamp,
            breeder: msg.sender,
            successful: false,
            offspringId: 0
        });

        recordsByBreeder[msg.sender].push(recordId);

        emit BreedingRecorded(recordId, msg.sender, sireId, damId);
        return recordId;
    }

    function markSuccessful(uint256 recordId, uint256 offspringId) public {
        require(breedingRecords[recordId].breeder == msg.sender, "Not the breeder");
        breedingRecords[recordId].successful = true;
        breedingRecords[recordId].offspringId = offspringId;
    }

    function getRecord(uint256 recordId) public view returns (BreedingRecord memory) {
        return breedingRecords[recordId];
    }
}

