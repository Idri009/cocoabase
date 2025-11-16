// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmRegenerativeAgricultureTracking
 * @dev Regenerative agriculture practices tracking
 */
contract FarmRegenerativeAgricultureTracking is Ownable {
    struct Practice {
        uint256 practiceId;
        address farmer;
        uint256 fieldId;
        string practiceType;
        uint256 implementationDate;
        bool verified;
    }

    mapping(uint256 => Practice) public practices;
    mapping(address => uint256[]) public practicesByFarmer;
    mapping(uint256 => uint256[]) public practicesByField;
    mapping(address => bool) public isVerifier;
    uint256 private _practiceIdCounter;

    event PracticeRecorded(
        uint256 indexed practiceId,
        address indexed farmer,
        string practiceType
    );
    event PracticeVerified(uint256 indexed practiceId, address indexed verifier);

    constructor() Ownable(msg.sender) {
        isVerifier[msg.sender] = true;
    }

    function addVerifier(address verifier) public onlyOwner {
        isVerifier[verifier] = true;
    }

    function recordPractice(
        uint256 fieldId,
        string memory practiceType
    ) public returns (uint256) {
        uint256 practiceId = _practiceIdCounter++;
        practices[practiceId] = Practice({
            practiceId: practiceId,
            farmer: msg.sender,
            fieldId: fieldId,
            practiceType: practiceType,
            implementationDate: block.timestamp,
            verified: false
        });
        practicesByFarmer[msg.sender].push(practiceId);
        practicesByField[fieldId].push(practiceId);
        emit PracticeRecorded(practiceId, msg.sender, practiceType);
        return practiceId;
    }

    function verifyPractice(uint256 practiceId) public {
        require(isVerifier[msg.sender], "Not a verifier");
        require(!practices[practiceId].verified, "Already verified");
        practices[practiceId].verified = true;
        emit PracticeVerified(practiceId, msg.sender);
    }
}
