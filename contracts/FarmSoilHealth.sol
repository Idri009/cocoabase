// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilHealth
 * @dev Onchain soil health monitoring and tracking
 */
contract FarmSoilHealth is Ownable {
    struct SoilHealthRecord {
        uint256 recordId;
        address farmer;
        string location;
        uint256 timestamp;
        uint256 phLevel;
        uint256 nitrogenLevel;
        uint256 phosphorusLevel;
        uint256 potassiumLevel;
        uint256 organicMatter;
        string soilType;
        string healthStatus;
    }

    mapping(uint256 => SoilHealthRecord) public soilHealthRecords;
    mapping(address => uint256[]) public recordsByFarmer;
    mapping(string => uint256[]) public recordsByLocation;
    uint256 private _recordIdCounter;

    event SoilHealthRecorded(
        uint256 indexed recordId,
        address indexed farmer,
        string location,
        uint256 timestamp,
        string healthStatus
    );

    constructor() Ownable(msg.sender) {}

    function recordSoilHealth(
        string memory location,
        uint256 phLevel,
        uint256 nitrogenLevel,
        uint256 phosphorusLevel,
        uint256 potassiumLevel,
        uint256 organicMatter,
        string memory soilType,
        string memory healthStatus
    ) public returns (uint256) {
        require(phLevel > 0 && phLevel <= 14, "Invalid pH level");
        require(nitrogenLevel >= 0, "Invalid nitrogen level");
        require(phosphorusLevel >= 0, "Invalid phosphorus level");
        require(potassiumLevel >= 0, "Invalid potassium level");

        uint256 recordId = _recordIdCounter++;
        soilHealthRecords[recordId] = SoilHealthRecord({
            recordId: recordId,
            farmer: msg.sender,
            location: location,
            timestamp: block.timestamp,
            phLevel: phLevel,
            nitrogenLevel: nitrogenLevel,
            phosphorusLevel: phosphorusLevel,
            potassiumLevel: potassiumLevel,
            organicMatter: organicMatter,
            soilType: soilType,
            healthStatus: healthStatus
        });

        recordsByFarmer[msg.sender].push(recordId);
        recordsByLocation[location].push(recordId);

        emit SoilHealthRecorded(recordId, msg.sender, location, block.timestamp, healthStatus);
        return recordId;
    }

    function getSoilHealthRecord(uint256 recordId) public view returns (SoilHealthRecord memory) {
        return soilHealthRecords[recordId];
    }

    function getRecordsByFarmer(address farmer) public view returns (uint256[] memory) {
        return recordsByFarmer[farmer];
    }

    function getRecordsByLocation(string memory location) public view returns (uint256[] memory) {
        return recordsByLocation[location];
    }
}

