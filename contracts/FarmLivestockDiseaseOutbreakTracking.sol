// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockDiseaseOutbreakTracking
 * @dev Onchain disease outbreak tracking and containment management
 */
contract FarmLivestockDiseaseOutbreakTracking is Ownable {
    struct OutbreakRecord {
        uint256 recordId;
        address farmer;
        string diseaseType;
        uint256 outbreakDate;
        uint256 affectedCount;
        string containmentMeasures;
        uint256 resolutionDate;
        bool isContained;
    }

    mapping(uint256 => OutbreakRecord) public outbreaks;
    mapping(address => uint256[]) public outbreaksByFarmer;
    uint256 private _outbreakIdCounter;

    event OutbreakRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string diseaseType,
        uint256 affectedCount
    );

    constructor() Ownable(msg.sender) {}

    function recordOutbreak(
        string memory diseaseType,
        uint256 outbreakDate,
        uint256 affectedCount,
        string memory containmentMeasures
    ) public returns (uint256) {
        uint256 recordId = _outbreakIdCounter++;
        outbreaks[recordId] = OutbreakRecord({
            recordId: recordId,
            farmer: msg.sender,
            diseaseType: diseaseType,
            outbreakDate: outbreakDate,
            affectedCount: affectedCount,
            containmentMeasures: containmentMeasures,
            resolutionDate: 0,
            isContained: false
        });

        outbreaksByFarmer[msg.sender].push(recordId);
        emit OutbreakRecorded(recordId, msg.sender, diseaseType, affectedCount);
        return recordId;
    }

    function markContained(uint256 recordId) public {
        require(outbreaks[recordId].farmer == msg.sender, "Not record owner");
        outbreaks[recordId].isContained = true;
        outbreaks[recordId].resolutionDate = block.timestamp;
    }

    function getOutbreak(uint256 recordId) public view returns (OutbreakRecord memory) {
        return outbreaks[recordId];
    }
}

