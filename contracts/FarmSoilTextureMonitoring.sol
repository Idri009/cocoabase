// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilTextureMonitoring
 * @dev Onchain soil texture changes monitoring over time
 */
contract FarmSoilTextureMonitoring is Ownable {
    struct TextureRecord {
        uint256 recordId;
        address farmer;
        string fieldId;
        uint256 sandPercentage;
        uint256 siltPercentage;
        uint256 clayPercentage;
        uint256 recordDate;
        string textureClass;
    }

    mapping(uint256 => TextureRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    uint256 private _recordIdCounter;

    event TextureRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string fieldId,
        string textureClass
    );

    constructor() Ownable(msg.sender) {}

    function recordTexture(
        string memory fieldId,
        uint256 sandPercentage,
        uint256 siltPercentage,
        uint256 clayPercentage,
        string memory textureClass
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        records[recordId] = TextureRecord({
            recordId: recordId,
            farmer: msg.sender,
            fieldId: fieldId,
            sandPercentage: sandPercentage,
            siltPercentage: siltPercentage,
            clayPercentage: clayPercentage,
            recordDate: block.timestamp,
            textureClass: textureClass
        });

        recordsByFarmer[msg.sender].push(recordId);
        emit TextureRecorded(recordId, msg.sender, fieldId, textureClass);
        return recordId;
    }

    function getRecord(uint256 recordId) public view returns (TextureRecord memory) {
        return records[recordId];
    }
}
