// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockVaccinationEffectiveness
 * @dev Vaccination effectiveness tracking and analysis
 */
contract FarmLivestockVaccinationEffectiveness is Ownable {
    struct EffectivenessRecord {
        uint256 recordId;
        address farmer;
        string livestockId;
        string vaccineType;
        bool diseasePrevented;
        uint256 protectionPeriod;
        uint256 recordDate;
        bool effective;
    }

    mapping(uint256 => EffectivenessRecord) public records;
    uint256 private _recordIdCounter;

    event RecordCreated(
        uint256 indexed recordId,
        address indexed farmer,
        bool effective
    );

    constructor() Ownable(msg.sender) {}

    function recordEffectiveness(
        string memory livestockId,
        string memory vaccineType,
        bool diseasePrevented,
        uint256 protectionPeriod
    ) public returns (uint256) {
        bool effective = diseasePrevented && protectionPeriod >= 180;
        uint256 recordId = _recordIdCounter++;
        records[recordId] = EffectivenessRecord({
            recordId: recordId,
            farmer: msg.sender,
            livestockId: livestockId,
            vaccineType: vaccineType,
            diseasePrevented: diseasePrevented,
            protectionPeriod: protectionPeriod,
            recordDate: block.timestamp,
            effective: effective
        });

        emit RecordCreated(recordId, msg.sender, effective);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (EffectivenessRecord memory) {
        return records[recordId];
    }
}
