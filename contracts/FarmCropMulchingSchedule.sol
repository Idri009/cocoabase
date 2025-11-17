// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropMulchingSchedule
 * @dev Onchain mulching schedule and material tracking
 */
contract FarmCropMulchingSchedule is Ownable {
    struct MulchingRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        string materialType;
        uint256 quantity;
        uint256 applicationDate;
        string benefits;
    }

    mapping(uint256 => MulchingRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event MulchingRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        string materialType
    );

    constructor() Ownable(msg.sender) {}

    function recordMulching(
        string memory fieldId,
        string memory materialType,
        uint256 quantity,
        string memory benefits
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = MulchingRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            materialType: materialType,
            quantity: quantity,
            applicationDate: block.timestamp,
            benefits: benefits
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit MulchingRecorded(recordId, msg.sender, fieldId, materialType);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (MulchingRecord memory) {
        return records[recordId];
    }
}
