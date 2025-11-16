// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmQualityInspections
 * @dev Quality inspection scheduling and result tracking
 */
contract FarmQualityInspections is Ownable {
    struct Inspection {
        uint256 inspectionId;
        address inspector;
        address farm;
        string inspectionType;
        uint256 scheduledDate;
        uint256 completedDate;
        uint256 qualityScore;
        bool passed;
        string report;
    }

    mapping(uint256 => Inspection) public inspections;
    mapping(address => uint256[]) public inspectionsByFarm;
    uint256 private _inspectionIdCounter;

    event InspectionScheduled(
        uint256 indexed inspectionId,
        address indexed farm,
        uint256 scheduledDate
    );

    event InspectionCompleted(
        uint256 indexed inspectionId,
        bool passed,
        uint256 qualityScore
    );

    constructor() Ownable(msg.sender) {}

    function scheduleInspection(
        address farm,
        string memory inspectionType,
        uint256 scheduledDate
    ) public returns (uint256) {
        uint256 inspectionId = _inspectionIdCounter++;
        inspections[inspectionId] = Inspection({
            inspectionId: inspectionId,
            inspector: msg.sender,
            farm: farm,
            inspectionType: inspectionType,
            scheduledDate: scheduledDate,
            completedDate: 0,
            qualityScore: 0,
            passed: false,
            report: ""
        });

        inspectionsByFarm[farm].push(inspectionId);
        emit InspectionScheduled(inspectionId, farm, scheduledDate);
        return inspectionId;
    }

    function completeInspection(
        uint256 inspectionId,
        uint256 qualityScore,
        bool passed,
        string memory report
    ) public {
        require(inspections[inspectionId].inspector == msg.sender, "Not authorized");
        require(inspections[inspectionId].completedDate == 0, "Already completed");
        inspections[inspectionId].completedDate = block.timestamp;
        inspections[inspectionId].qualityScore = qualityScore;
        inspections[inspectionId].passed = passed;
        inspections[inspectionId].report = report;
        emit InspectionCompleted(inspectionId, passed, qualityScore);
    }

    function getInspection(uint256 inspectionId) public view returns (Inspection memory) {
        return inspections[inspectionId];
    }
}
