// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmBiodiversityIndex
 * @dev Onchain biodiversity index calculation and tracking
 */
contract FarmBiodiversityIndex is Ownable {
    struct BiodiversityRecord {
        uint256 recordId;
        address farmer;
        string speciesType;
        uint256 speciesCount;
        string habitat;
        uint256 timestamp;
        uint256 biodiversityScore;
    }

    mapping(uint256 => BiodiversityRecord) public records;
    mapping(address => uint256[]) public recordsByFarmer;
    mapping(address => uint256) public biodiversityIndexByFarmer;
    uint256 private _recordIdCounter;

    event BiodiversityRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string speciesType,
        uint256 biodiversityScore
    );

    constructor() Ownable(msg.sender) {}

    function recordBiodiversity(
        string memory speciesType,
        uint256 speciesCount,
        string memory habitat
    ) public returns (uint256) {
        require(speciesCount > 0, "Species count must be greater than 0");

        uint256 recordId = _recordIdCounter++;
        uint256 biodiversityScore = calculateBiodiversityScore(speciesType, speciesCount);

        records[recordId] = BiodiversityRecord({
            recordId: recordId,
            farmer: msg.sender,
            speciesType: speciesType,
            speciesCount: speciesCount,
            habitat: habitat,
            timestamp: block.timestamp,
            biodiversityScore: biodiversityScore
        });

        recordsByFarmer[msg.sender].push(recordId);
        biodiversityIndexByFarmer[msg.sender] += biodiversityScore;

        emit BiodiversityRecorded(recordId, msg.sender, speciesType, biodiversityScore);
        return recordId;
    }

    function calculateBiodiversityScore(string memory, uint256 speciesCount) internal pure returns (uint256) {
        return speciesCount * 10;
    }

    function getRecord(uint256 recordId) public view returns (BiodiversityRecord memory) {
        return records[recordId];
    }

    function getBiodiversityIndex(address farmer) public view returns (uint256) {
        return biodiversityIndexByFarmer[farmer];
    }
}

