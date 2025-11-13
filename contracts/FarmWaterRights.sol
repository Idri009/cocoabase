// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWaterRights
 * @dev Onchain water rights management and allocation
 */
contract FarmWaterRights is Ownable {
    struct WaterRight {
        uint256 rightId;
        address owner;
        uint256 allocationAmount; // in liters
        uint256 usedAmount;
        uint256 startDate;
        uint256 endDate;
        string source;
        bool active;
    }

    mapping(uint256 => WaterRight) public waterRights;
    mapping(address => uint256[]) public rightsByOwner;
    uint256 private _rightIdCounter;

    event WaterRightIssued(
        uint256 indexed rightId,
        address indexed owner,
        uint256 allocationAmount
    );

    event WaterUsageRecorded(
        uint256 indexed rightId,
        uint256 amount,
        uint256 remaining
    );

    constructor() Ownable(msg.sender) {}

    function issueWaterRight(
        address owner,
        uint256 allocationAmount,
        uint256 startDate,
        uint256 endDate,
        string memory source
    ) public onlyOwner returns (uint256) {
        uint256 rightId = _rightIdCounter++;
        waterRights[rightId] = WaterRight({
            rightId: rightId,
            owner: owner,
            allocationAmount: allocationAmount,
            usedAmount: 0,
            startDate: startDate,
            endDate: endDate,
            source: source,
            active: true
        });

        rightsByOwner[owner].push(rightId);

        emit WaterRightIssued(rightId, owner, allocationAmount);
        return rightId;
    }

    function recordWaterUsage(uint256 rightId, uint256 amount) public {
        WaterRight storage right = waterRights[rightId];
        require(right.owner == msg.sender, "Not the owner");
        require(right.active, "Right not active");
        require(block.timestamp >= right.startDate && block.timestamp <= right.endDate, "Outside validity period");
        require(right.usedAmount + amount <= right.allocationAmount, "Exceeds allocation");

        right.usedAmount += amount;

        emit WaterUsageRecorded(rightId, amount, right.allocationAmount - right.usedAmount);
    }

    function getWaterRight(uint256 rightId) public view returns (WaterRight memory) {
        return waterRights[rightId];
    }

    function getRightsByOwner(address owner) public view returns (uint256[] memory) {
        return rightsByOwner[owner];
    }
}

