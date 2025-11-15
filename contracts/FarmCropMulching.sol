// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropMulching
 * @dev Onchain system for tracking crop mulching activities
 */
contract FarmCropMulching is Ownable {
    struct MulchingRecord {
        uint256 recordId;
        uint256 plantationId;
        string mulchType;
        uint256 areaMulched;
        uint256 mulchingDate;
        address mulcher;
    }

    mapping(uint256 => MulchingRecord) public mulchingRecords;
    mapping(address => uint256[]) public recordsByMulcher;
    uint256 private _recordIdCounter;

    event MulchingRecorded(
        uint256 indexed recordId,
        address indexed mulcher,
        uint256 areaMulched
    );

    constructor() Ownable(msg.sender) {}

    function recordMulching(
        uint256 plantationId,
        string memory mulchType,
        uint256 areaMulched
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        mulchingRecords[recordId] = MulchingRecord({
            recordId: recordId,
            plantationId: plantationId,
            mulchType: mulchType,
            areaMulched: areaMulched,
            mulchingDate: block.timestamp,
            mulcher: msg.sender
        });

        recordsByMulcher[msg.sender].push(recordId);

        emit MulchingRecorded(recordId, msg.sender, areaMulched);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (MulchingRecord memory) {
        return mulchingRecords[recordId];
    }
}



