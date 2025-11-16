// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockGrazingRotation
 * @dev Grazing rotation scheduling and pasture management
 */
contract FarmLivestockGrazingRotation is Ownable {
    struct Rotation {
        uint256 rotationId;
        address farmer;
        string pastureId;
        uint256 startDate;
        uint256 endDate;
        uint256 livestockCount;
        bool active;
    }

    mapping(uint256 => Rotation) public rotations;
    mapping(address => uint256[]) public rotationsByFarmer;
    uint256 private _rotationIdCounter;

    event RotationStarted(
        uint256 indexed rotationId,
        address indexed farmer,
        string pastureId
    );

    event RotationEnded(
        uint256 indexed rotationId,
        uint256 endDate
    );

    constructor() Ownable(msg.sender) {}

    function startRotation(
        string memory pastureId,
        uint256 endDate,
        uint256 livestockCount
    ) public returns (uint256) {
        uint256 rotationId = _rotationIdCounter++;
        rotations[rotationId] = Rotation({
            rotationId: rotationId,
            farmer: msg.sender,
            pastureId: pastureId,
            startDate: block.timestamp,
            endDate: endDate,
            livestockCount: livestockCount,
            active: true
        });

        rotationsByFarmer[msg.sender].push(rotationId);
        emit RotationStarted(rotationId, msg.sender, pastureId);
        return rotationId;
    }

    function endRotation(uint256 rotationId) public {
        require(rotations[rotationId].farmer == msg.sender, "Not authorized");
        require(rotations[rotationId].active, "Not active");
        rotations[rotationId].active = false;
        emit RotationEnded(rotationId, block.timestamp);
    }

    function getRotation(uint256 rotationId) public view returns (Rotation memory) {
        return rotations[rotationId];
    }
}
