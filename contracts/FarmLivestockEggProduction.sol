// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockEggProduction
 * @dev Onchain system for tracking egg production and quality
 */
contract FarmLivestockEggProduction is Ownable {
    struct EggProductionRecord {
        uint256 recordId;
        uint256 flockId;
        uint256 eggsCollected;
        uint256 eggsGradeA;
        uint256 eggsGradeB;
        uint256 eggsGradeC;
        uint256 collectionDate;
        address collector;
    }

    mapping(uint256 => EggProductionRecord) public eggProductionRecords;
    mapping(address => uint256[]) public recordsByCollector;
    uint256 private _recordIdCounter;

    event EggProductionRecorded(
        uint256 indexed recordId,
        address indexed collector,
        uint256 eggsCollected
    );

    constructor() Ownable(msg.sender) {}

    function recordEggProduction(
        uint256 flockId,
        uint256 eggsCollected,
        uint256 eggsGradeA,
        uint256 eggsGradeB,
        uint256 eggsGradeC,
        uint256 collectionDate
    ) public returns (uint256) {
        require(eggsCollected == eggsGradeA + eggsGradeB + eggsGradeC, "Grade mismatch");
        uint256 recordId = _recordIdCounter++;
        eggProductionRecords[recordId] = EggProductionRecord({
            recordId: recordId,
            flockId: flockId,
            eggsCollected: eggsCollected,
            eggsGradeA: eggsGradeA,
            eggsGradeB: eggsGradeB,
            eggsGradeC: eggsGradeC,
            collectionDate: collectionDate,
            collector: msg.sender
        });

        recordsByCollector[msg.sender].push(recordId);

        emit EggProductionRecorded(recordId, msg.sender, eggsCollected);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (EggProductionRecord memory) {
        return eggProductionRecords[recordId];
    }
}


