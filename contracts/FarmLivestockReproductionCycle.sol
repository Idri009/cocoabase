// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockReproductionCycle
 * @dev Onchain reproduction cycle tracking and breeding management
 */
contract FarmLivestockReproductionCycle is Ownable {
    struct ReproductionCycle {
        uint256 cycleId;
        address farmer;
        string livestockId;
        uint256 estrusDate;
        uint256 breedingDate;
        uint256 expectedCalvingDate;
        uint256 actualCalvingDate;
        string status;
    }

    mapping(uint256 => ReproductionCycle) public cycles;
    mapping(address => uint256[]) public cyclesByFarmer;
    mapping(string => uint256[]) public cyclesByLivestock;
    uint256 private _cycleIdCounter;

    event CycleRecorded(
        uint256 indexed cycleId,
        address indexed farmer,
        string livestockId,
        string status
    );

    constructor() Ownable(msg.sender) {}

    function recordCycle(
        string memory livestockId,
        uint256 estrusDate,
        uint256 breedingDate,
        uint256 expectedCalvingDate,
        string memory status
    ) public returns (uint256) {
        uint256 cycleId = _cycleIdCounter++;
        cycles[cycleId] = ReproductionCycle({
            cycleId: cycleId,
            farmer: msg.sender,
            livestockId: livestockId,
            estrusDate: estrusDate,
            breedingDate: breedingDate,
            expectedCalvingDate: expectedCalvingDate,
            actualCalvingDate: 0,
            status: status
        });

        cyclesByFarmer[msg.sender].push(cycleId);
        cyclesByLivestock[livestockId].push(cycleId);
        emit CycleRecorded(cycleId, msg.sender, livestockId, status);
        return cycleId;
    }

    function recordCalving(uint256 cycleId, uint256 actualCalvingDate) public {
        require(cycles[cycleId].farmer == msg.sender, "Not cycle owner");
        cycles[cycleId].actualCalvingDate = actualCalvingDate;
        cycles[cycleId].status = "Completed";
    }

    function getCycle(uint256 cycleId) public view returns (ReproductionCycle memory) {
        return cycles[cycleId];
    }
}

