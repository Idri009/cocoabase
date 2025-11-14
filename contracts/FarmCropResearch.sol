// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropResearch
 * @dev Onchain crop research data sharing
 */
contract FarmCropResearch is Ownable {
    struct ResearchProject {
        uint256 projectId;
        address researcher;
        string title;
        string description;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
        uint256 budget;
        string category;
    }

    struct ResearchData {
        uint256 dataId;
        uint256 projectId;
        address contributor;
        string dataType;
        string dataValue;
        uint256 timestamp;
        bool isPublic;
    }

    mapping(uint256 => ResearchProject) public researchProjects;
    mapping(uint256 => ResearchData[]) public projectData;
    mapping(address => uint256[]) public projectsByResearcher;
    uint256 private _projectIdCounter;
    uint256 private _dataIdCounter;

    event ResearchProjectCreated(
        uint256 indexed projectId,
        address indexed researcher,
        string title,
        uint256 budget
    );

    event ResearchDataAdded(
        uint256 indexed dataId,
        uint256 indexed projectId,
        address indexed contributor,
        string dataType
    );

    event ResearchProjectCompleted(
        uint256 indexed projectId,
        address indexed researcher
    );

    constructor() Ownable(msg.sender) {}

    function createResearchProject(
        string memory title,
        string memory description,
        uint256 endDate,
        uint256 budget,
        string memory category
    ) public returns (uint256) {
        require(endDate > block.timestamp, "Invalid end date");
        require(budget > 0, "Budget must be greater than 0");

        uint256 projectId = _projectIdCounter++;
        researchProjects[projectId] = ResearchProject({
            projectId: projectId,
            researcher: msg.sender,
            title: title,
            description: description,
            startDate: block.timestamp,
            endDate: endDate,
            isActive: true,
            budget: budget,
            category: category
        });

        projectsByResearcher[msg.sender].push(projectId);

        emit ResearchProjectCreated(projectId, msg.sender, title, budget);
        return projectId;
    }

    function addResearchData(
        uint256 projectId,
        string memory dataType,
        string memory dataValue,
        bool isPublic
    ) public returns (uint256) {
        require(researchProjects[projectId].isActive, "Project not active");
        require(
            researchProjects[projectId].researcher == msg.sender ||
            isPublic,
            "Not authorized"
        );

        uint256 dataId = _dataIdCounter++;
        ResearchData memory data = ResearchData({
            dataId: dataId,
            projectId: projectId,
            contributor: msg.sender,
            dataType: dataType,
            dataValue: dataValue,
            timestamp: block.timestamp,
            isPublic: isPublic
        });

        projectData[projectId].push(data);

        emit ResearchDataAdded(dataId, projectId, msg.sender, dataType);
        return dataId;
    }

    function completeResearchProject(uint256 projectId) public {
        require(researchProjects[projectId].researcher == msg.sender, "Not the researcher");
        require(researchProjects[projectId].isActive, "Project not active");
        require(block.timestamp >= researchProjects[projectId].endDate, "Project not ended");

        researchProjects[projectId].isActive = false;

        emit ResearchProjectCompleted(projectId, msg.sender);
    }

    function getResearchProject(uint256 projectId) public view returns (ResearchProject memory) {
        return researchProjects[projectId];
    }

    function getResearchData(uint256 projectId) public view returns (ResearchData[] memory) {
        return projectData[projectId];
    }

    function getProjectsByResearcher(address researcher) public view returns (uint256[] memory) {
        return projectsByResearcher[researcher];
    }
}

