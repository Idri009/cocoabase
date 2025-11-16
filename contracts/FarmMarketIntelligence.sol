// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmMarketIntelligence
 * @dev Market intelligence and analytics
 */
contract FarmMarketIntelligence is Ownable {
    struct MarketReport {
        uint256 reportId;
        address analyst;
        string commodity;
        uint256 price;
        uint256 demand;
        uint256 supply;
        uint256 timestamp;
    }

    mapping(uint256 => MarketReport) public marketReports;
    mapping(string => uint256[]) public reportsByCommodity;
    mapping(address => bool) public isAnalyst;
    uint256 private _reportIdCounter;

    event ReportCreated(uint256 indexed reportId, string commodity);
    event AnalystAdded(address indexed analyst);

    constructor() Ownable(msg.sender) {
        isAnalyst[msg.sender] = true;
    }

    function addAnalyst(address analyst) public onlyOwner {
        isAnalyst[analyst] = true;
        emit AnalystAdded(analyst);
    }

    function createReport(
        string memory commodity,
        uint256 price,
        uint256 demand,
        uint256 supply
    ) public returns (uint256) {
        require(isAnalyst[msg.sender], "Not an analyst");
        uint256 reportId = _reportIdCounter++;
        marketReports[reportId] = MarketReport({
            reportId: reportId,
            analyst: msg.sender,
            commodity: commodity,
            price: price,
            demand: demand,
            supply: supply,
            timestamp: block.timestamp
        });
        reportsByCommodity[commodity].push(reportId);
        emit ReportCreated(reportId, commodity);
        return reportId;
    }

    function getLatestReport(string memory commodity) public view returns (MarketReport memory) {
        require(reportsByCommodity[commodity].length > 0, "No reports found");
        uint256 latestId = reportsByCommodity[commodity][reportsByCommodity[commodity].length - 1];
        return marketReports[latestId];
    }
}

