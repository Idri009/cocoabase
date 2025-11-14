// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilCarbonSequestration
 * @dev Onchain tracking of carbon sequestration in farm soil
 */
contract FarmSoilCarbonSequestration is Ownable {
    struct CarbonSequestration {
        uint256 plantationId;
        uint256 carbonAmount;
        uint256 measurementDate;
        string soilType;
        address measurer;
        bool verified;
        uint256 creditsEarned;
    }

    mapping(uint256 => CarbonSequestration) public sequestrations;
    mapping(address => uint256[]) public sequestrationsByOwner;
    uint256 private _sequestrationIdCounter;

    event CarbonSequestrationRecorded(
        uint256 indexed sequestrationId,
        address indexed owner,
        uint256 carbonAmount
    );

    event CarbonCreditsIssued(
        uint256 indexed sequestrationId,
        uint256 creditsEarned
    );

    constructor() Ownable(msg.sender) {}

    function recordSequestration(
        uint256 plantationId,
        uint256 carbonAmount,
        string memory soilType
    ) public returns (uint256) {
        uint256 sequestrationId = _sequestrationIdCounter++;
        uint256 creditsEarned = carbonAmount / 1000; // 1 credit per ton

        sequestrations[sequestrationId] = CarbonSequestration({
            plantationId: plantationId,
            carbonAmount: carbonAmount,
            measurementDate: block.timestamp,
            soilType: soilType,
            measurer: msg.sender,
            verified: false,
            creditsEarned: creditsEarned
        });

        sequestrationsByOwner[msg.sender].push(sequestrationId);

        emit CarbonSequestrationRecorded(sequestrationId, msg.sender, carbonAmount);
        return sequestrationId;
    }

    function verifySequestration(uint256 sequestrationId) public onlyOwner {
        require(!sequestrations[sequestrationId].verified, "Already verified");
        sequestrations[sequestrationId].verified = true;

        emit CarbonCreditsIssued(
            sequestrationId,
            sequestrations[sequestrationId].creditsEarned
        );
    }

    function getSequestration(uint256 sequestrationId) public view returns (CarbonSequestration memory) {
        return sequestrations[sequestrationId];
    }
}

