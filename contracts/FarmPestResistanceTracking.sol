// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmPestResistanceTracking
 * @dev Track pest resistance development to treatments
 */
contract FarmPestResistanceTracking is Ownable {
    struct ResistanceRecord {
        uint256 recordId;
        address farmer;
        string pestType;
        string treatmentType;
        uint256 resistanceLevel;
        uint256 treatmentEffectiveness;
        uint256 recordDate;
    }

    mapping(uint256 => ResistanceRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event ResistanceRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string pestType
    );

    constructor() Ownable(msg.sender) {}

    function recordResistance(
        string memory pestType,
        string memory treatmentType,
        uint256 resistanceLevel,
        uint256 treatmentEffectiveness
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = ResistanceRecord({
            recordId: recordId,
            farmer: msg.sender,
            pestType: pestType,
            treatmentType: treatmentType,
            resistanceLevel: resistanceLevel,
            treatmentEffectiveness: treatmentEffectiveness,
            recordDate: block.timestamp
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit ResistanceRecorded(recordId, msg.sender, pestType);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (ResistanceRecord memory) {
        return records[recordId];
    }
}
