// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropIntercroppingManagement
 * @dev Manage intercropping systems
 */
contract FarmCropIntercroppingManagement is Ownable {
    struct IntercroppingSystem {
        uint256 systemId;
        uint256 fieldId;
        string[] cropTypes;
        uint256 spacing;
        uint256 implementationDate;
        address implementer;
    }

    mapping(uint256 => IntercroppingSystem) public systems;
    mapping(address => uint256[]) public systemsByOwner;
    uint256 private _systemIdCounter;

    event SystemCreated(
        uint256 indexed systemId,
        address indexed owner,
        uint256 fieldId
    );

    constructor() Ownable(msg.sender) {}

    function createSystem(
        uint256 fieldId,
        string[] memory cropTypes,
        uint256 spacing
    ) public returns (uint256) {
        uint256 systemId = _systemIdCounter++;
        systems[systemId] = IntercroppingSystem({
            systemId: systemId,
            fieldId: fieldId,
            cropTypes: cropTypes,
            spacing: spacing,
            implementationDate: block.timestamp,
            implementer: msg.sender
        });

        systemsByOwner[msg.sender].push(systemId);

        emit SystemCreated(systemId, msg.sender, fieldId);
        return systemId;
    }

    function getSystem(uint256 systemId) public view returns (IntercroppingSystem memory) {
        return systems[systemId];
    }

    function getSystemsByOwner(address owner) public view returns (uint256[] memory) {
        return systemsByOwner[owner];
    }
}



