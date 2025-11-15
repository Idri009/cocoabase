// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockMortalityReporting
 * @dev Onchain mortality reporting and cause tracking
 */
contract FarmLivestockMortalityReporting is Ownable {
    struct MortalityReport {
        uint256 reportId;
        address farmer;
        string livestockId;
        uint256 deathDate;
        string cause;
        string diagnosis;
        address veterinarian;
    }

    mapping(uint256 => MortalityReport) public reports;
    mapping(address => uint256[]) public reportsByFarmer;
    uint256 private _reportIdCounter;

    event MortalityReported(
        uint256 indexed reportId,
        address indexed farmer,
        string livestockId,
        string cause
    );

    constructor() Ownable(msg.sender) {}

    function reportMortality(
        string memory livestockId,
        uint256 deathDate,
        string memory cause,
        string memory diagnosis,
        address veterinarian
    ) public returns (uint256) {
        uint256 reportId = _reportIdCounter++;
        reports[reportId] = MortalityReport({
            reportId: reportId,
            farmer: msg.sender,
            livestockId: livestockId,
            deathDate: deathDate,
            cause: cause,
            diagnosis: diagnosis,
            veterinarian: veterinarian
        });

        reportsByFarmer[msg.sender].push(reportId);
        emit MortalityReported(reportId, msg.sender, livestockId, cause);
        return reportId;
    }

    function getReport(uint256 reportId) public view returns (MortalityReport memory) {
        return reports[reportId];
    }
}

