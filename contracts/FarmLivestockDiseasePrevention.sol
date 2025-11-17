// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockDiseasePrevention
 * @dev Onchain disease prevention protocols for livestock
 */
contract FarmLivestockDiseasePrevention is Ownable {
    struct PreventionRecord {
        uint256 recordId;
        address farmer;
        string livestockId;
        string preventionMethod;
        uint256 applicationDate;
        string diseaseTarget;
        bool isEffective;
    }

    mapping(uint256 => PreventionRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event PreventionRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string livestockId,
        string preventionMethod
    );

    constructor() Ownable(msg.sender) {}

    function recordPrevention(
        string memory livestockId,
        string memory preventionMethod,
        string memory diseaseTarget
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = PreventionRecord({
            recordId: recordId,
            farmer: msg.sender,
            livestockId: livestockId,
            preventionMethod: preventionMethod,
            applicationDate: block.timestamp,
            diseaseTarget: diseaseTarget,
            isEffective: false
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit PreventionRecorded(recordId, msg.sender, livestockId, preventionMethod);
        return recordId;
    }

    function markEffective(uint256 recordId) public {
        require(records[recordId].farmer == msg.sender, "Not record owner");
        records[recordId].isEffective = true;
    }

    function getRecord(uint256 recordId) public view returns (PreventionRecord memory) {
        return records[recordId];
    }
}
