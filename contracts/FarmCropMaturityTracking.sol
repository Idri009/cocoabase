// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropMaturityTracking
 * @dev Onchain crop maturity tracking and harvest readiness assessment
 */
contract FarmCropMaturityTracking is Ownable {
    struct MaturityRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        string cropType;
        uint256 maturityPercentage;
        uint256 assessmentDate;
        string maturityStage;
        bool isReadyForHarvest;
    }

    mapping(uint256 => MaturityRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event MaturityRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        uint256 maturityPercentage
    );

    constructor() Ownable(msg.sender) {}

    function recordMaturity(
        string memory fieldId,
        string memory cropType,
        uint256 maturityPercentage,
        string memory maturityStage
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        bool isReadyForHarvest = maturityPercentage >= 90;

        records[recordId] = MaturityRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            cropType: cropType,
            maturityPercentage: maturityPercentage,
            assessmentDate: block.timestamp,
            maturityStage: maturityStage,
            isReadyForHarvest: isReadyForHarvest
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit MaturityRecorded(recordId, msg.sender, fieldId, maturityPercentage);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (MaturityRecord memory) {
        return records[recordId];
    }
}

