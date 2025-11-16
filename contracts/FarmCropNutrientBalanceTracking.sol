// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropNutrientBalanceTracking
 * @dev Onchain crop nutrient balance and deficiencies tracking
 */
contract FarmCropNutrientBalanceTracking is Ownable {
    struct NutrientBalance {
        uint256 recordId;
        address farmer;
        string fieldId;
        uint256 nitrogen;
        uint256 phosphorus;
        uint256 potassium;
        uint256 recordDate;
        string deficiencies;
        string recommendations;
    }

    mapping(uint256 => NutrientBalance) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event BalanceRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId
    );

    constructor() Ownable(msg.sender) {}

    function recordBalance(
        string memory fieldId,
        uint256 nitrogen,
        uint256 phosphorus,
        uint256 potassium,
        string memory deficiencies,
        string memory recommendations
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = NutrientBalance({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            nitrogen: nitrogen,
            phosphorus: phosphorus,
            potassium: potassium,
            recordDate: block.timestamp,
            deficiencies: deficiencies,
            recommendations: recommendations
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit BalanceRecorded(recordId, msg.sender, fieldId);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (NutrientBalance memory) {
        return records[recordId];
    }
}

