// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmProductionAnalytics
 * @dev Onchain production analytics
 */
contract FarmProductionAnalytics is Ownable {
    struct ProductionData {
        uint256 dataId;
        address farmOwner;
        uint256 yield;
        uint256 area;
        uint256 efficiency;
        string cropType;
        uint256 date;
    }

    mapping(uint256 => ProductionData) public productionData;
    mapping(address => uint256[]) public dataByOwner;
    uint256 private _dataIdCounter;

    event DataRecorded(
        uint256 indexed dataId,
        address indexed farmOwner,
        uint256 yield,
        string cropType
    );

    constructor() Ownable(msg.sender) {}

    function recordProduction(
        uint256 yield_,
        uint256 area,
        string memory cropType
    ) public returns (uint256) {
        uint256 efficiency = area > 0 ? (yield_ * 10000) / area : 0;

        uint256 dataId = _dataIdCounter++;
        productionData[dataId] = ProductionData({
            dataId: dataId,
            farmOwner: msg.sender,
            yield: yield_,
            area: area,
            efficiency: efficiency,
            cropType: cropType,
            date: block.timestamp
        });

        dataByOwner[msg.sender].push(dataId);

        emit DataRecorded(dataId, msg.sender, yield_, cropType);
        return dataId;
    }

    function getProductionData(uint256 dataId) public view returns (ProductionData memory) {
        return productionData[dataId];
    }

    function getDataByOwner(address owner) public view returns (uint256[] memory) {
        return dataByOwner[owner];
    }
}

