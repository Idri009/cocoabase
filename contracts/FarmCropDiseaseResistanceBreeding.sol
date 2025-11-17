// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropDiseaseResistanceBreeding
 * @dev Disease resistance breeding program tracking
 */
contract FarmCropDiseaseResistanceBreeding is Ownable {
    struct BreedingProgram {
        uint256 programId;
        address breeder;
        string cropVariety;
        string targetDisease;
        uint256 resistanceLevel;
        bool active;
    }

    mapping(uint256 => BreedingProgram) public programs;
    mapping(address => uint256[]) public programsByBreeder;
    uint256 private _programIdCounter;

    event ProgramCreated(uint256 indexed programId, string cropVariety);
    event ResistanceUpdated(uint256 indexed programId, uint256 resistanceLevel);

    constructor() Ownable(msg.sender) {}

    function createProgram(
        string memory cropVariety,
        string memory targetDisease
    ) public returns (uint256) {
        uint256 programId = _programIdCounter++;
        programs[programId] = BreedingProgram({
            programId: programId,
            breeder: msg.sender,
            cropVariety: cropVariety,
            targetDisease: targetDisease,
            resistanceLevel: 0,
            active: true
        });
        programsByBreeder[msg.sender].push(programId);
        emit ProgramCreated(programId, cropVariety);
        return programId;
    }

    function updateResistance(uint256 programId, uint256 resistanceLevel) public {
        require(programs[programId].breeder == msg.sender, "Not the breeder");
        programs[programId].resistanceLevel = resistanceLevel;
        emit ResistanceUpdated(programId, resistanceLevel);
    }
}

