// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmGrievanceManagement
 * @dev Onchain grievance registry and remediation tracking for farmers and workers
 */
contract FarmGrievanceManagement is Ownable {
    enum GrievanceStatus {
        Open,
        InReview,
        Resolved,
        Rejected
    }

    struct Grievance {
        uint256 grievanceId;
        address submitter;
        string category;
        string description;
        GrievanceStatus status;
        string resolution;
        uint256 submittedAt;
        uint256 updatedAt;
    }

    mapping(uint256 => Grievance) public grievances;
    mapping(address => uint256[]) public grievancesBySubmitter;
    uint256 private _grievanceIdCounter;

    event GrievanceSubmitted(
        uint256 indexed grievanceId,
        address indexed submitter,
        string category
    );

    event GrievanceStatusUpdated(
        uint256 indexed grievanceId,
        GrievanceStatus status
    );

    constructor() Ownable(msg.sender) {}

    function submitGrievance(
        string memory category,
        string memory description
    ) public returns (uint256) {
        uint256 grievanceId = _grievanceIdCounter++;
        grievances[grievanceId] = Grievance({
            grievanceId: grievanceId,
            submitter: msg.sender,
            category: category,
            description: description,
            status: GrievanceStatus.Open,
            resolution: "",
            submittedAt: block.timestamp,
            updatedAt: block.timestamp
        });

        grievancesBySubmitter[msg.sender].push(grievanceId);
        emit GrievanceSubmitted(grievanceId, msg.sender, category);
        return grievanceId;
    }

    function updateGrievanceStatus(
        uint256 grievanceId,
        GrievanceStatus status,
        string memory resolution
    ) public onlyOwner {
        Grievance storage g = grievances[grievanceId];
        g.status = status;
        g.resolution = resolution;
        g.updatedAt = block.timestamp;
        emit GrievanceStatusUpdated(grievanceId, status);
    }

    function getGrievance(uint256 grievanceId) public view returns (Grievance memory) {
        return grievances[grievanceId];
    }
}


