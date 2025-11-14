// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockVaccination
 * @dev Onchain system for tracking livestock vaccinations
 */
contract FarmLivestockVaccination is Ownable {
    struct VaccinationRecord {
        uint256 recordId;
        uint256 livestockId;
        string vaccineType;
        uint256 vaccinationDate;
        uint256 nextDueDate;
        address vaccinator;
    }

    mapping(uint256 => VaccinationRecord) public vaccinationRecords;
    mapping(address => uint256[]) public recordsByVaccinator;
    uint256 private _recordIdCounter;

    event VaccinationRecorded(
        uint256 indexed recordId,
        address indexed vaccinator,
        string vaccineType
    );

    constructor() Ownable(msg.sender) {}

    function recordVaccination(
        uint256 livestockId,
        string memory vaccineType,
        uint256 validityPeriod
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        vaccinationRecords[recordId] = VaccinationRecord({
            recordId: recordId,
            livestockId: livestockId,
            vaccineType: vaccineType,
            vaccinationDate: block.timestamp,
            nextDueDate: block.timestamp + validityPeriod,
            vaccinator: msg.sender
        });

        recordsByVaccinator[msg.sender].push(recordId);

        emit VaccinationRecorded(recordId, msg.sender, vaccineType);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (VaccinationRecord memory) {
        return vaccinationRecords[recordId];
    }
}


