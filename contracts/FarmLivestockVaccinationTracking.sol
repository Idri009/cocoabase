// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockVaccinationTracking
 * @dev Vaccination tracking and schedule management
 */
contract FarmLivestockVaccinationTracking is Ownable {
    struct Vaccination {
        uint256 vaccinationId;
        address farmer;
        string livestockId;
        string vaccineType;
        uint256 vaccinationDate;
        uint256 nextDueDate;
        bool completed;
    }

    mapping(uint256 => Vaccination) public vaccinations;
    mapping(address => uint256[]) public vaccinationsByFarmer;
    uint256 private _vaccinationIdCounter;

    event VaccinationRecorded(
        uint256 indexed vaccinationId,
        address indexed farmer,
        string vaccineType
    );

    constructor() Ownable(msg.sender) {}

    function recordVaccination(
        string memory livestockId,
        string memory vaccineType,
        uint256 nextDueDate
    ) public returns (uint256) {
        uint256 vaccinationId = _vaccinationIdCounter++;
        vaccinations[vaccinationId] = Vaccination({
            vaccinationId: vaccinationId,
            farmer: msg.sender,
            livestockId: livestockId,
            vaccineType: vaccineType,
            vaccinationDate: block.timestamp,
            nextDueDate: nextDueDate,
            completed: true
        });

        vaccinationsByFarmer[msg.sender].push(vaccinationId);
        emit VaccinationRecorded(vaccinationId, msg.sender, vaccineType);
        return vaccinationId;
    }

    function getVaccination(uint256 vaccinationId) public view returns (Vaccination memory) {
        return vaccinations[vaccinationId];
    }
}
