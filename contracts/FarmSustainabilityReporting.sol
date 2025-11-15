// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSustainabilityReporting
 * @dev Comprehensive sustainability reporting and metrics tracking
 */
contract FarmSustainabilityReporting is Ownable {
    struct SustainabilityReport {
        uint256 reportId;
        address farmer;
        string reportPeriod;
        uint256 carbonFootprint;
        uint256 waterUsage;
        uint256 biodiversityScore;
        uint256 sustainabilityScore;
        uint256 reportDate;
        string metadata;
        bool verified;
    }

    mapping(uint256 => SustainabilityReport) public reports;
    mapping(address => uint256[]) public reportsByFarmer;
    uint256 private _reportIdCounter;

    event ReportSubmitted(
        uint256 indexed reportId,
        address indexed farmer,
        uint256 sustainabilityScore
    );

    event ReportVerified(
        uint256 indexed reportId,
        address indexed verifier
    );

    constructor() Ownable(msg.sender) {}

    function submitReport(
        string memory reportPeriod,
        uint256 carbonFootprint,
        uint256 waterUsage,
        uint256 biodiversityScore,
        uint256 sustainabilityScore,
        string memory metadata
    ) public returns (uint256) {
        uint256 reportId = _reportIdCounter++;
        reports[reportId] = SustainabilityReport({
            reportId: reportId,
            farmer: msg.sender,
            reportPeriod: reportPeriod,
            carbonFootprint: carbonFootprint,
            waterUsage: waterUsage,
            biodiversityScore: biodiversityScore,
            sustainabilityScore: sustainabilityScore,
            reportDate: block.timestamp,
            metadata: metadata,
            verified: false
        });

        reportsByFarmer[msg.sender].push(reportId);
        emit ReportSubmitted(reportId, msg.sender, sustainabilityScore);
        return reportId;
    }

    function verifyReport(uint256 reportId) public onlyOwner {
        require(!reports[reportId].verified, "Already verified");
        reports[reportId].verified = true;
        emit ReportVerified(reportId, msg.sender);
    }

    function getReport(uint256 reportId) public view returns (SustainabilityReport memory) {
        return reports[reportId];
    }
}
