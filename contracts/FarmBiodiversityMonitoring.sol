// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmBiodiversityMonitoring
 * @dev Biodiversity monitoring and species tracking
 */
contract FarmBiodiversityMonitoring is Ownable {
    struct BiodiversityRecord {
        uint256 recordId;
        address farmer;
        string speciesType;
        uint256 populationCount;
        uint256 observationDate;
        string habitatType;
    }

    mapping(uint256 => BiodiversityRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event RecordCreated(
        uint256 indexed recordId,
        address indexed farmer,
        string speciesType
    );

    constructor() Ownable(msg.sender) {}

    function createRecord(
        string memory speciesType,
        uint256 populationCount,
        string memory habitatType
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = BiodiversityRecord({
            recordId: recordId,
            farmer: msg.sender,
            speciesType: speciesType,
            populationCount: populationCount,
            observationDate: block.timestamp,
            habitatType: habitatType
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit RecordCreated(recordId, msg.sender, speciesType);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (BiodiversityRecord memory) {
        return records[recordId];
    }
}
