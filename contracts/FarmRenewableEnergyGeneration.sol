// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmRenewableEnergyGeneration
 * @dev Onchain system for tracking renewable energy generation on farms
 */
contract FarmRenewableEnergyGeneration is Ownable {
    struct EnergyGenerationRecord {
        uint256 recordId;
        uint256 facilityId;
        uint256 energyGenerated;
        string energySource;
        uint256 generationDate;
        address recorder;
    }

    mapping(uint256 => EnergyGenerationRecord) public energyGenerationRecords;
    mapping(address => uint256[]) public recordsByRecorder;
    uint256 private _recordIdCounter;

    event EnergyGenerationRecorded(
        uint256 indexed recordId,
        address indexed recorder,
        uint256 energyGenerated
    );

    constructor() Ownable(msg.sender) {}

    function recordEnergyGeneration(
        uint256 facilityId,
        uint256 energyGenerated,
        string memory energySource,
        uint256 generationDate
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        energyGenerationRecords[recordId] = EnergyGenerationRecord({
            recordId: recordId,
            facilityId: facilityId,
            energyGenerated: energyGenerated,
            energySource: energySource,
            generationDate: generationDate,
            recorder: msg.sender
        });

        recordsByRecorder[msg.sender].push(recordId);

        emit EnergyGenerationRecorded(recordId, msg.sender, energyGenerated);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (EnergyGenerationRecord memory) {
        return energyGenerationRecords[recordId];
    }
}

