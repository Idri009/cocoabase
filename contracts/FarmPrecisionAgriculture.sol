// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmPrecisionAgriculture
 * @dev Store precision agriculture data and analytics
 */
contract FarmPrecisionAgriculture is Ownable {
    struct PrecisionData {
        uint256 dataId;
        address farmer;
        uint256 fieldId;
        string dataType;
        bytes32 dataHash;
        uint256 timestamp;
    }

    mapping(uint256 => PrecisionData) public precisionData;
    mapping(address => uint256[]) public dataByFarmer;
    mapping(uint256 => uint256[]) public dataByField;
    uint256 private _dataIdCounter;

    event PrecisionDataRecorded(
        uint256 indexed dataId,
        address indexed farmer,
        string dataType
    );

    constructor() Ownable(msg.sender) {}

    function recordData(
        uint256 fieldId,
        string memory dataType,
        bytes32 dataHash
    ) public returns (uint256) {
        uint256 dataId = _dataIdCounter++;
        precisionData[dataId] = PrecisionData({
            dataId: dataId,
            farmer: msg.sender,
            fieldId: fieldId,
            dataType: dataType,
            dataHash: dataHash,
            timestamp: block.timestamp
        });
        dataByFarmer[msg.sender].push(dataId);
        dataByField[fieldId].push(dataId);
        emit PrecisionDataRecorded(dataId, msg.sender, dataType);
        return dataId;
    }

    function getFieldDataCount(uint256 fieldId) public view returns (uint256) {
        return dataByField[fieldId].length;
    }
}
