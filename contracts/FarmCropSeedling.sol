// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropSeedling
 * @dev Onchain system for tracking crop seedling management
 */
contract FarmCropSeedling is Ownable {
    struct SeedlingRecord {
        uint256 recordId;
        uint256 plantationId;
        uint256 seedlingsPlanted;
        uint256 plantingDate;
        string seedlingType;
        address planter;
    }

    mapping(uint256 => SeedlingRecord) public seedlingRecords;
    mapping(address => uint256[]) public recordsByPlanter;
    uint256 private _recordIdCounter;

    event SeedlingPlanted(
        uint256 indexed recordId,
        address indexed planter,
        uint256 seedlingsPlanted
    );

    constructor() Ownable(msg.sender) {}

    function recordSeedling(
        uint256 plantationId,
        uint256 seedlingsPlanted,
        string memory seedlingType
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        seedlingRecords[recordId] = SeedlingRecord({
            recordId: recordId,
            plantationId: plantationId,
            seedlingsPlanted: seedlingsPlanted,
            plantingDate: block.timestamp,
            seedlingType: seedlingType,
            planter: msg.sender
        });

        recordsByPlanter[msg.sender].push(recordId);

        emit SeedlingPlanted(recordId, msg.sender, seedlingsPlanted);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (SeedlingRecord memory) {
        return seedlingRecords[recordId];
    }
}



