// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmAgTechIntegration
 * @dev Agricultural technology integration platform
 */
contract FarmAgTechIntegration is Ownable {
    struct TechIntegration {
        uint256 integrationId;
        address farmer;
        string techType;
        bytes32 deviceHash;
        bool active;
    }

    mapping(uint256 => TechIntegration) public integrations;
    mapping(address => uint256[]) public integrationsByFarmer;
    uint256 private _integrationIdCounter;

    event IntegrationCreated(uint256 indexed integrationId, string techType);
    event IntegrationActivated(uint256 indexed integrationId);

    constructor() Ownable(msg.sender) {}

    function createIntegration(
        string memory techType,
        bytes32 deviceHash
    ) public returns (uint256) {
        uint256 integrationId = _integrationIdCounter++;
        integrations[integrationId] = TechIntegration({
            integrationId: integrationId,
            farmer: msg.sender,
            techType: techType,
            deviceHash: deviceHash,
            active: false
        });
        integrationsByFarmer[msg.sender].push(integrationId);
        emit IntegrationCreated(integrationId, techType);
        return integrationId;
    }

    function activateIntegration(uint256 integrationId) public {
        require(integrations[integrationId].farmer == msg.sender, "Not the owner");
        integrations[integrationId].active = true;
        emit IntegrationActivated(integrationId);
    }
}

