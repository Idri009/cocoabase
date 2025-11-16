// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWaterFiltrationTracking
 * @dev Onchain water filtration system tracking and efficiency monitoring
 */
contract FarmWaterFiltrationTracking is Ownable {
    struct FiltrationRecord {
        uint256 recordId;
        address farmer;
        string filtrationSystemId;
        uint256 inputQuality;
        uint256 outputQuality;
        uint256 efficiency;
        uint256 recordDate;
        string maintenanceStatus;
    }

    mapping(uint256 => FiltrationRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event FiltrationRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string filtrationSystemId,
        uint256 efficiency
    );

    constructor() Ownable(msg.sender) {}

    function recordFiltration(
        string memory filtrationSystemId,
        uint256 inputQuality,
        uint256 outputQuality,
        string memory maintenanceStatus
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        uint256 efficiency = (outputQuality * 100) / inputQuality;

        records[recordId] = FiltrationRecord({
            recordId: recordId,
            farmer: msg.sender,
            filtrationSystemId: filtrationSystemId,
            inputQuality: inputQuality,
            outputQuality: outputQuality,
            efficiency: efficiency,
            recordDate: block.timestamp,
            maintenanceStatus: maintenanceStatus
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit FiltrationRecorded(recordId, msg.sender, filtrationSystemId, efficiency);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (FiltrationRecord memory) {
        return records[recordId];
    }
}

