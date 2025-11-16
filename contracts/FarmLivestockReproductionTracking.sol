// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockReproductionTracking
 * @dev Track livestock reproduction cycles and breeding success
 */
contract FarmLivestockReproductionTracking is Ownable {
    struct ReproductionCycle {
        uint256 cycleId;
        uint256 livestockId;
        uint256 breedingDate;
        uint256 expectedBirthDate;
        uint256 actualBirthDate;
        uint256 offspringCount;
        address breeder;
        bool completed;
    }

    struct BreedingPerformance {
        uint256 livestockId;
        uint256 totalCycles;
        uint256 successfulCycles;
        uint256 totalOffspring;
        uint256 successRate;
    }

    mapping(uint256 => ReproductionCycle) public reproductionCycles;
    mapping(uint256 => BreedingPerformance) public breedingPerformance;
    mapping(address => uint256[]) public cyclesByOwner;
    uint256 private _cycleIdCounter;

    event ReproductionCycleStarted(
        uint256 indexed cycleId,
        address indexed owner,
        uint256 livestockId
    );

    event BirthRecorded(
        uint256 indexed cycleId,
        uint256 offspringCount
    );

    constructor() Ownable(msg.sender) {}

    function startReproductionCycle(
        uint256 livestockId,
        uint256 expectedBirthDate
    ) public returns (uint256) {
        uint256 cycleId = _cycleIdCounter++;
        reproductionCycles[cycleId] = ReproductionCycle({
            cycleId: cycleId,
            livestockId: livestockId,
            breedingDate: block.timestamp,
            expectedBirthDate: expectedBirthDate,
            actualBirthDate: 0,
            offspringCount: 0,
            breeder: msg.sender,
            completed: false
        });

        cyclesByOwner[msg.sender].push(cycleId);

        emit ReproductionCycleStarted(cycleId, msg.sender, livestockId);
        return cycleId;
    }

    function recordBirth(
        uint256 cycleId,
        uint256 offspringCount
    ) public {
        require(reproductionCycles[cycleId].breeder == msg.sender, "Not breeder");
        reproductionCycles[cycleId].actualBirthDate = block.timestamp;
        reproductionCycles[cycleId].offspringCount = offspringCount;
        reproductionCycles[cycleId].completed = true;

        uint256 livestockId = reproductionCycles[cycleId].livestockId;
        breedingPerformance[livestockId].totalCycles++;
        breedingPerformance[livestockId].successfulCycles++;
        breedingPerformance[livestockId].totalOffspring += offspringCount;
        breedingPerformance[livestockId].successRate = 
            (breedingPerformance[livestockId].successfulCycles * 100) / 
            breedingPerformance[livestockId].totalCycles;

        emit BirthRecorded(cycleId, offspringCount);
    }

    function getReproductionCycle(uint256 cycleId) public view returns (ReproductionCycle memory) {
        return reproductionCycles[cycleId];
    }

    function getCyclesByOwner(address owner) public view returns (uint256[] memory) {
        return cyclesByOwner[owner];
    }
}



