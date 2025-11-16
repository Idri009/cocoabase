// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropHarvestLogistics
 * @dev Onchain harvest logistics and transportation coordination
 */
contract FarmCropHarvestLogistics is Ownable {
    struct LogisticsRecord {
        uint256 recordId;
        address farmer;
        string harvestBatchId;
        string destination;
        uint256 quantity;
        uint256 transportDate;
        string transportMethod;
        string status;
    }

    mapping(uint256 => LogisticsRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event LogisticsRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string harvestBatchId,
        string destination
    );

    constructor() Ownable(msg.sender) {}

    function recordLogistics(
        string memory harvestBatchId,
        string memory destination,
        uint256 quantity,
        uint256 transportDate,
        string memory transportMethod
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = LogisticsRecord({
            recordId: recordId,
            farmer: msg.sender,
            harvestBatchId: harvestBatchId,
            destination: destination,
            quantity: quantity,
            transportDate: transportDate,
            transportMethod: transportMethod,
            status: "Scheduled"
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit LogisticsRecorded(recordId, msg.sender, harvestBatchId, destination);
        return recordId;
    }

    function updateStatus(uint256 recordId, string memory status) public {
        require(records[recordId].farmer == msg.sender, "Not record owner");
        records[recordId].status = status;
    }

    function getRecord(uint256 recordId) public view returns (LogisticsRecord memory) {
        return records[recordId];
    }
}

