// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLaborPool
 * @dev Onchain labor pooling system
 */
contract FarmLaborPool is Ownable {
    struct Worker {
        address workerAddress;
        string name;
        string skills;
        uint256 hourlyRate;
        bool isAvailable;
        uint256 joinDate;
        uint256 rating;
        uint256 totalJobs;
    }

    struct Job {
        uint256 jobId;
        address employer;
        string jobDescription;
        uint256 startDate;
        uint256 endDate;
        uint256 hourlyRate;
        uint256 totalHours;
        bool isActive;
        bool isCompleted;
        address worker;
    }

    mapping(address => Worker) public workers;
    mapping(uint256 => Job) public jobs;
    address[] public workerList;
    uint256 private _jobIdCounter;

    event WorkerRegistered(address indexed worker, string name, string skills);
    event JobCreated(uint256 indexed jobId, address indexed employer, string jobDescription);
    event JobAssigned(uint256 indexed jobId, address indexed worker);
    event JobCompleted(uint256 indexed jobId, address indexed worker);

    constructor() Ownable(msg.sender) {}

    function registerWorker(
        string memory name,
        string memory skills,
        uint256 hourlyRate
    ) public {
        require(hourlyRate > 0, "Hourly rate must be greater than 0");
        require(workers[msg.sender].workerAddress == address(0), "Already registered");

        workers[msg.sender] = Worker({
            workerAddress: msg.sender,
            name: name,
            skills: skills,
            hourlyRate: hourlyRate,
            isAvailable: true,
            joinDate: block.timestamp,
            rating: 0,
            totalJobs: 0
        });

        workerList.push(msg.sender);

        emit WorkerRegistered(msg.sender, name, skills);
    }

    function createJob(
        string memory jobDescription,
        uint256 startDate,
        uint256 endDate,
        uint256 hourlyRate,
        uint256 totalHours
    ) public returns (uint256) {
        require(endDate > startDate, "Invalid dates");
        require(hourlyRate > 0, "Hourly rate must be greater than 0");
        require(totalHours > 0, "Total hours must be greater than 0");

        uint256 jobId = _jobIdCounter++;
        jobs[jobId] = Job({
            jobId: jobId,
            employer: msg.sender,
            jobDescription: jobDescription,
            startDate: startDate,
            endDate: endDate,
            hourlyRate: hourlyRate,
            totalHours: totalHours,
            isActive: true,
            isCompleted: false,
            worker: address(0)
        });

        emit JobCreated(jobId, msg.sender, jobDescription);
        return jobId;
    }

    function assignJob(uint256 jobId, address worker) public {
        require(jobs[jobId].employer == msg.sender, "Not the employer");
        require(jobs[jobId].isActive, "Job not active");
        require(jobs[jobId].worker == address(0), "Job already assigned");
        require(workers[worker].isAvailable, "Worker not available");

        jobs[jobId].worker = worker;
        workers[worker].isAvailable = false;

        emit JobAssigned(jobId, worker);
    }

    function completeJob(uint256 jobId) public {
        require(jobs[jobId].worker == msg.sender, "Not the worker");
        require(jobs[jobId].isActive, "Job not active");
        require(!jobs[jobId].isCompleted, "Job already completed");

        jobs[jobId].isCompleted = true;
        jobs[jobId].isActive = false;
        workers[msg.sender].isAvailable = true;
        workers[msg.sender].totalJobs++;

        emit JobCompleted(jobId, msg.sender);
    }

    function getWorker(address workerAddress) public view returns (Worker memory) {
        return workers[workerAddress];
    }

    function getJob(uint256 jobId) public view returns (Job memory) {
        return jobs[jobId];
    }

    function getWorkerCount() public view returns (uint256) {
        return workerList.length;
    }
}

