// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropPestPopulationTracking
 * @dev Pest population density tracking and monitoring
 */
contract FarmCropPestPopulationTracking is Ownable {
    struct PopulationRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        string pestType;
        uint256 populationDensity;
        uint256 recordDate;
        bool thresholdExceeded;
    }

    mapping(uint256 => PopulationRecord) public records;
    uint256 private _recordIdCounter;

    event RecordCreated(
        uint256 indexed recordId,
        address indexed farmer,
        uint256 populationDensity
    );

    constructor() Ownable(msg.sender) {}

    function recordPopulation(
        string memory fieldId,
        string memory pestType,
        uint256 populationDensity
    ) public returns (uint256) {
        bool thresholdExceeded = populationDensity > 100;
        uint256 recordId = _recordIdCounter++;
        records[recordId] = PopulationRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            pestType: pestType,
            populationDensity: populationDensity,
            recordDate: block.timestamp,
            thresholdExceeded: thresholdExceeded
        });

        emit RecordCreated(recordId, msg.sender, populationDensity);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (PopulationRecord memory) {
        return records[recordId];
    }
}
