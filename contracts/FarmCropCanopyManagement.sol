// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropCanopyManagement
 * @dev Onchain crop canopy management for optimal light penetration
 */
contract FarmCropCanopyManagement is Ownable {
    struct CanopyRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        uint256 canopyCoverage;
        uint256 lightPenetration;
        uint256 recordDate;
        string managementAction;
        uint256 effectiveness;
    }

    mapping(uint256 => CanopyRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event CanopyRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        uint256 canopyCoverage
    );

    constructor() Ownable(msg.sender) {}

    function recordCanopy(
        string memory fieldId,
        uint256 canopyCoverage,
        uint256 lightPenetration,
        string memory managementAction,
        uint256 effectiveness
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = CanopyRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            canopyCoverage: canopyCoverage,
            lightPenetration: lightPenetration,
            recordDate: block.timestamp,
            managementAction: managementAction,
            effectiveness: effectiveness
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit CanopyRecorded(recordId, msg.sender, fieldId, canopyCoverage);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (CanopyRecord memory) {
        return records[recordId];
    }
}
