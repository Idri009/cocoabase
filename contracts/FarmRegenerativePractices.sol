// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmRegenerativePractices
 * @dev Regenerative agriculture practices tracking
 */
contract FarmRegenerativePractices is Ownable {
    struct Practice {
        uint256 practiceId;
        address farmer;
        string practiceType;
        uint256 implementationDate;
        uint256 impactScore;
        bool verified;
    }

    mapping(uint256 => Practice) public practices;
    mapping(address => uint256[]) public practicesByFarmer;
    uint256 private _practiceIdCounter;

    event PracticeRecorded(
        uint256 indexed practiceId,
        address indexed farmer,
        string practiceType
    );

    event PracticeVerified(
        uint256 indexed practiceId,
        uint256 impactScore
    );

    constructor() Ownable(msg.sender) {}

    function recordPractice(
        string memory practiceType
    ) public returns (uint256) {
        uint256 practiceId = _practiceIdCounter++;
        practices[practiceId] = Practice({
            practiceId: practiceId,
            farmer: msg.sender,
            practiceType: practiceType,
            implementationDate: block.timestamp,
            impactScore: 0,
            verified: false
        });

        practicesByFarmer[msg.sender].push(practiceId);
        emit PracticeRecorded(practiceId, msg.sender, practiceType);
        return practiceId;
    }

    function verifyPractice(uint256 practiceId, uint256 impactScore) public onlyOwner {
        practices[practiceId].verified = true;
        practices[practiceId].impactScore = impactScore;
        emit PracticeVerified(practiceId, impactScore);
    }

    function getPractice(uint256 practiceId) public view returns (Practice memory) {
        return practices[practiceId];
    }
}
