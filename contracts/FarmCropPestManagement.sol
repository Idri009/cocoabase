// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropPestManagement
 * @dev Onchain pest management and control tracking
 */
contract FarmCropPestManagement is Ownable {
    struct PestRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        string pestType;
        uint256 severity;
        string controlMethod;
        uint256 recordDate;
        bool isControlled;
    }

    mapping(uint256 => PestRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event PestRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        string pestType
    );

    constructor() Ownable(msg.sender) {}

    function recordPest(
        string memory fieldId,
        string memory pestType,
        uint256 severity,
        string memory controlMethod
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = PestRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            pestType: pestType,
            severity: severity,
            controlMethod: controlMethod,
            recordDate: block.timestamp,
            isControlled: false
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit PestRecorded(recordId, msg.sender, fieldId, pestType);
        return recordId;
    }

    function markControlled(uint256 recordId) public {
        require(records[recordId].farmer == msg.sender, "Not record owner");
        records[recordId].isControlled = true;
    }

    function getRecord(uint256 recordId) public view returns (PestRecord memory) {
        return records[recordId];
    }
}

