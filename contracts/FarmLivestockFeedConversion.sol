// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockFeedConversion
 * @dev Track feed conversion ratios for livestock efficiency
 */
contract FarmLivestockFeedConversion is Ownable {
    struct FeedConversion {
        uint256 recordId;
        address farmer;
        string livestockType;
        uint256 feedConsumed;
        uint256 weightGain;
        uint256 conversionRatio;
        uint256 recordDate;
    }

    mapping(uint256 => FeedConversion) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event ConversionRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        uint256 conversionRatio
    );

    constructor() Ownable(msg.sender) {}

    function recordConversion(
        string memory livestockType,
        uint256 feedConsumed,
        uint256 weightGain
    ) public returns (uint256) {
        require(weightGain > 0, "Invalid weight gain");
        uint256 conversionRatio = (feedConsumed * 10000) / weightGain;
        uint256 recordId = _recordIdCounter++;
        records[recordId] = FeedConversion({
            recordId: recordId,
            farmer: msg.sender,
            livestockType: livestockType,
            feedConsumed: feedConsumed,
            weightGain: weightGain,
            conversionRatio: conversionRatio,
            recordDate: block.timestamp
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit ConversionRecorded(recordId, msg.sender, conversionRatio);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (FeedConversion memory) {
        return records[recordId];
    }
}
