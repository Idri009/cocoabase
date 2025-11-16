// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmEnergyGenerationTracking
 * @dev Track energy generation from renewable sources
 */
contract FarmEnergyGenerationTracking is Ownable {
    struct GenerationRecord {
        uint256 recordId;
        address farmer;
        string energySource;
        uint256 energyGenerated;
        uint256 capacityUtilization;
        uint256 recordDate;
    }

    mapping(uint256 => GenerationRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event GenerationRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        uint256 energyGenerated
    );

    constructor() Ownable(msg.sender) {}

    function recordGeneration(
        string memory energySource,
        uint256 energyGenerated,
        uint256 capacityUtilization
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = GenerationRecord({
            recordId: recordId,
            farmer: msg.sender,
            energySource: energySource,
            energyGenerated: energyGenerated,
            capacityUtilization: capacityUtilization,
            recordDate: block.timestamp
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit GenerationRecorded(recordId, msg.sender, energyGenerated);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (GenerationRecord memory) {
        return records[recordId];
    }
}
