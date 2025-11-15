// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCarbonFootprintTracking
 * @dev Accurate carbon footprint calculation and tracking system
 */
contract FarmCarbonFootprintTracking is Ownable {
    struct FootprintRecord {
        uint256 recordId;
        address farmer;
        string activityType;
        uint256 co2Equivalent;
        uint256 recordDate;
        uint256 offsetCredits;
    }

    mapping(uint256 => FootprintRecord) public records;
    mapping(address => uint256) public totalFootprintByFarmer;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event FootprintRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        uint256 co2Equivalent
    );

    constructor() Ownable(msg.sender) {}

    function recordFootprint(
        string memory activityType,
        uint256 co2Equivalent,
        uint256 offsetCredits
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = FootprintRecord({
            recordId: recordId,
            farmer: msg.sender,
            activityType: activityType,
            co2Equivalent: co2Equivalent,
            recordDate: block.timestamp,
            offsetCredits: offsetCredits
        });

        totalFootprintByFarmer[msg.sender] += co2Equivalent;
        recordsByFarmer[msg.sender].push(recordId);
        emit FootprintRecorded(recordId, msg.sender, co2Equivalent);
        return recordId;
    }

    function getTotalFootprint(address farmer) public view returns (uint256) {
        return totalFootprintByFarmer[farmer];
    }

    function getRecord(uint256 recordId) public view returns (FootprintRecord memory) {
        return records[recordId];
    }
}
