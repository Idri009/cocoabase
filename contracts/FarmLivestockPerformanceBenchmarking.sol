// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockPerformanceBenchmarking
 * @dev Livestock performance benchmarking system
 */
contract FarmLivestockPerformanceBenchmarking is Ownable {
    struct Benchmark {
        uint256 benchmarkId;
        address farmer;
        uint256 animalId;
        uint256 weightGain;
        uint256 feedEfficiency;
        uint256 healthScore;
        uint256 timestamp;
    }

    mapping(uint256 => Benchmark) public benchmarks;
    mapping(address => uint256[]) public benchmarksByFarmer;
    uint256 private _benchmarkIdCounter;

    event BenchmarkRecorded(uint256 indexed benchmarkId, uint256 animalId);

    constructor() Ownable(msg.sender) {}

    function recordBenchmark(
        uint256 animalId,
        uint256 weightGain,
        uint256 feedEfficiency,
        uint256 healthScore
    ) public returns (uint256) {
        uint256 benchmarkId = _benchmarkIdCounter++;
        benchmarks[benchmarkId] = Benchmark({
            benchmarkId: benchmarkId,
            farmer: msg.sender,
            animalId: animalId,
            weightGain: weightGain,
            feedEfficiency: feedEfficiency,
            healthScore: healthScore,
            timestamp: block.timestamp
        });
        benchmarksByFarmer[msg.sender].push(benchmarkId);
        emit BenchmarkRecorded(benchmarkId, animalId);
        return benchmarkId;
    }
}

