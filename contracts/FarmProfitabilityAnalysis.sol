// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmProfitabilityAnalysis
 * @dev Onchain profitability analysis
 */
contract FarmProfitabilityAnalysis is Ownable {
    struct ProfitabilityReport {
        uint256 reportId;
        address farmOwner;
        uint256 revenue;
        uint256 costs;
        uint256 profit;
        uint256 profitMargin;
        uint256 periodStart;
        uint256 periodEnd;
        uint256 reportDate;
    }

    mapping(uint256 => ProfitabilityReport) public reports;
    mapping(address => uint256[]) public reportsByOwner;
    uint256 private _reportIdCounter;

    event ReportCreated(
        uint256 indexed reportId,
        address indexed farmOwner,
        uint256 profit
    );

    constructor() Ownable(msg.sender) {}

    function createReport(
        uint256 revenue,
        uint256 costs,
        uint256 periodStart,
        uint256 periodEnd
    ) public returns (uint256) {
        uint256 profit = revenue > costs ? revenue - costs : 0;
        uint256 profitMargin = revenue > 0 ? (profit * 10000) / revenue : 0;

        uint256 reportId = _reportIdCounter++;
        reports[reportId] = ProfitabilityReport({
            reportId: reportId,
            farmOwner: msg.sender,
            revenue: revenue,
            costs: costs,
            profit: profit,
            profitMargin: profitMargin,
            periodStart: periodStart,
            periodEnd: periodEnd,
            reportDate: block.timestamp
        });

        reportsByOwner[msg.sender].push(reportId);

        emit ReportCreated(reportId, msg.sender, profit);
        return reportId;
    }

    function getReport(uint256 reportId) public view returns (ProfitabilityReport memory) {
        return reports[reportId];
    }

    function getReportsByOwner(address owner) public view returns (uint256[] memory) {
        return reportsByOwner[owner];
    }
}

