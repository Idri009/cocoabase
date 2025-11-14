// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmYieldTracking
 * @dev Onchain yield tracking system
 */
contract FarmYieldTracking is Ownable {
    struct YieldRecord {
        uint256 recordId;
        address farmer;
        uint256 cropId;
        string cropType;
        uint256 fieldId;
        uint256 harvestDate;
        uint256 yieldAmount;
        uint256 area;
        uint256 yieldPerHectare;
        string location;
        string quality;
    }

    mapping(uint256 => YieldRecord) public yieldRecords;
    mapping(address => uint256[]) public recordsByFarmer;
    mapping(uint256 => uint256[]) public recordsByCrop;
    mapping(uint256 => uint256[]) public recordsByField;
    uint256 private _recordIdCounter;

    event YieldRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        uint256 indexed cropId,
        uint256 yieldAmount,
        uint256 yieldPerHectare
    );

    constructor() Ownable(msg.sender) {}

    function recordYield(
        uint256 cropId,
        string memory cropType,
        uint256 fieldId,
        uint256 harvestDate,
        uint256 yieldAmount,
        uint256 area,
        string memory location,
        string memory quality
    ) public returns (uint256) {
        require(yieldAmount > 0, "Yield amount must be greater than 0");
        require(area > 0, "Area must be greater than 0");
        require(harvestDate <= block.timestamp, "Invalid harvest date");

        uint256 yieldPerHectare = (yieldAmount * 10000) / area;

        uint256 recordId = _recordIdCounter++;
        yieldRecords[recordId] = YieldRecord({
            recordId: recordId,
            farmer: msg.sender,
            cropId: cropId,
            cropType: cropType,
            fieldId: fieldId,
            harvestDate: harvestDate,
            yieldAmount: yieldAmount,
            area: area,
            yieldPerHectare: yieldPerHectare,
            location: location,
            quality: quality
        });

        recordsByFarmer[msg.sender].push(recordId);
        recordsByCrop[cropId].push(recordId);
        recordsByField[fieldId].push(recordId);

        emit YieldRecorded(recordId, msg.sender, cropId, yieldAmount, yieldPerHectare);
        return recordId;
    }

    function updateYield(
        uint256 recordId,
        uint256 yieldAmount,
        uint256 area
    ) public {
        require(yieldRecords[recordId].farmer == msg.sender, "Not the farmer");
        require(yieldAmount > 0, "Yield amount must be greater than 0");
        require(area > 0, "Area must be greater than 0");

        uint256 yieldPerHectare = (yieldAmount * 10000) / area;
        yieldRecords[recordId].yieldAmount = yieldAmount;
        yieldRecords[recordId].area = area;
        yieldRecords[recordId].yieldPerHectare = yieldPerHectare;
    }

    function getYieldRecord(uint256 recordId) public view returns (YieldRecord memory) {
        return yieldRecords[recordId];
    }

    function getRecordsByFarmer(address farmer) public view returns (uint256[] memory) {
        return recordsByFarmer[farmer];
    }

    function getRecordsByCrop(uint256 cropId) public view returns (uint256[] memory) {
        return recordsByCrop[cropId];
    }

    function getRecordsByField(uint256 fieldId) public view returns (uint256[] memory) {
        return recordsByField[fieldId];
    }
}

