// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmPestResistanceTracking
 * @dev Onchain pest resistance development tracking to treatments
 */
contract FarmPestResistanceTracking is Ownable {
    struct ResistanceRecord {
        uint256 recordId;
        address farmer;
        string pestType;
        string treatmentType;
        uint256 resistanceLevel;
        uint256 effectiveness;
        uint256 recordDate;
        string alternativeTreatment;
    }

    mapping(uint256 => ResistanceRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event ResistanceRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string pestType,
        uint256 resistanceLevel
    );

    constructor() Ownable(msg.sender) {}

    function recordResistance(
        string memory pestType,
        string memory treatmentType,
        uint256 resistanceLevel,
        uint256 effectiveness,
        string memory alternativeTreatment
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = ResistanceRecord({
            recordId: recordId,
            farmer: msg.sender,
            pestType: pestType,
            treatmentType: treatmentType,
            resistanceLevel: resistanceLevel,
            effectiveness: effectiveness,
            recordDate: block.timestamp,
            alternativeTreatment: alternativeTreatment
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit ResistanceRecorded(recordId, msg.sender, pestType, resistanceLevel);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (ResistanceRecord memory) {
        return records[recordId];
    }
}
