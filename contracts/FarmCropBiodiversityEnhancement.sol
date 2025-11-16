// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropBiodiversityEnhancement
 * @dev Onchain biodiversity enhancement initiatives and impact tracking
 */
contract FarmCropBiodiversityEnhancement is Ownable {
    struct EnhancementInitiative {
        uint256 initiativeId;
        address farmer;
        string fieldId;
        string initiativeType;
        string implementation;
        uint256 implementationDate;
        uint256 biodiversityScore;
        string impact;
    }

    mapping(uint256 => EnhancementInitiative) public initiatives;
    mapping(address => uint256[]) public initiativesByFarmer;
    uint256 private _initiativeIdCounter;

    event InitiativeRecorded(
        uint256 indexed initiativeId,
        address indexed farmer,
        string fieldId,
        string initiativeType
    );

    constructor() Ownable(msg.sender) {}

    function recordInitiative(
        string memory fieldId,
        string memory initiativeType,
        string memory implementation,
        uint256 biodiversityScore,
        string memory impact
    ) public returns (uint256) {
        uint256 initiativeId = _initiativeIdCounter++;
        initiatives[initiativeId] = EnhancementInitiative({
            initiativeId: initiativeId,
            farmer: msg.sender,
            fieldId: fieldId,
            initiativeType: initiativeType,
            implementation: implementation,
            implementationDate: block.timestamp,
            biodiversityScore: biodiversityScore,
            impact: impact
        });

        initiativesByFarmer[msg.sender].push(initiativeId);
        emit InitiativeRecorded(initiativeId, msg.sender, fieldId, initiativeType);
        return initiativeId;
    }

    function getInitiative(uint256 initiativeId) public view returns (EnhancementInitiative memory) {
        return initiatives[initiativeId];
    }
}
