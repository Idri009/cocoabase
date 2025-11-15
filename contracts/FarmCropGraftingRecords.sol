// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropGraftingRecords
 * @dev Onchain grafting records and success tracking
 */
contract FarmCropGraftingRecords is Ownable {
    struct GraftingRecord {
        uint256 recordId;
        address farmer;
        string rootstockId;
        string scionId;
        uint256 graftingDate;
        bool isSuccessful;
        string notes;
    }

    mapping(uint256 => GraftingRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event GraftingRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string rootstockId,
        string scionId
    );

    constructor() Ownable(msg.sender) {}

    function recordGrafting(
        string memory rootstockId,
        string memory scionId,
        uint256 graftingDate,
        string memory notes
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = GraftingRecord({
            recordId: recordId,
            farmer: msg.sender,
            rootstockId: rootstockId,
            scionId: scionId,
            graftingDate: graftingDate,
            isSuccessful: false,
            notes: notes
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit GraftingRecorded(recordId, msg.sender, rootstockId, scionId);
        return recordId;
    }

    function markSuccess(uint256 recordId) public {
        require(records[recordId].farmer == msg.sender, "Not record owner");
        records[recordId].isSuccessful = true;
    }

    function getRecord(uint256 recordId) public view returns (GraftingRecord memory) {
        return records[recordId];
    }
}

