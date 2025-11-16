// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmEnergyEfficiencyImprovements
 * @dev Onchain energy efficiency improvements tracking
 */
contract FarmEnergyEfficiencyImprovements is Ownable {
    struct ImprovementRecord {
        uint256 recordId;
        address farmer;
        string improvementType;
        uint256 beforeConsumption;
        uint256 afterConsumption;
        uint256 savings;
        uint256 implementationDate;
        string description;
    }

    mapping(uint256 => ImprovementRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event ImprovementRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string improvementType,
        uint256 savings
    );

    constructor() Ownable(msg.sender) {}

    function recordImprovement(
        string memory improvementType,
        uint256 beforeConsumption,
        uint256 afterConsumption,
        string memory description
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        uint256 savings = beforeConsumption - afterConsumption;

        records[recordId] = ImprovementRecord({
            recordId: recordId,
            farmer: msg.sender,
            improvementType: improvementType,
            beforeConsumption: beforeConsumption,
            afterConsumption: afterConsumption,
            savings: savings,
            implementationDate: block.timestamp,
            description: description
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit ImprovementRecorded(recordId, msg.sender, improvementType, savings);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (ImprovementRecord memory) {
        return records[recordId];
    }
}

