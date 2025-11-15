// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWaterConservation
 * @dev Water conservation initiatives and impact tracking
 */
contract FarmWaterConservation is Ownable {
    struct ConservationInitiative {
        uint256 initiativeId;
        address farmer;
        string initiativeType;
        uint256 waterSaved;
        uint256 implementationDate;
        bool verified;
    }

    mapping(uint256 => ConservationInitiative) public initiatives;
    mapping(address => uint256[]) public initiativesByFarmer;
    uint256 private _initiativeIdCounter;

    event InitiativeRegistered(
        uint256 indexed initiativeId,
        address indexed farmer,
        string initiativeType
    );

    constructor() Ownable(msg.sender) {}

    function registerInitiative(
        string memory initiativeType,
        uint256 waterSaved
    ) public returns (uint256) {
        uint256 initiativeId = _initiativeIdCounter++;
        initiatives[initiativeId] = ConservationInitiative({
            initiativeId: initiativeId,
            farmer: msg.sender,
            initiativeType: initiativeType,
            waterSaved: waterSaved,
            implementationDate: block.timestamp,
            verified: false
        });

        initiativesByFarmer[msg.sender].push(initiativeId);
        emit InitiativeRegistered(initiativeId, msg.sender, initiativeType);
        return initiativeId;
    }

    function verifyInitiative(uint256 initiativeId) public onlyOwner {
        initiatives[initiativeId].verified = true;
    }

    function getInitiative(uint256 initiativeId) public view returns (ConservationInitiative memory) {
        return initiatives[initiativeId];
    }
}