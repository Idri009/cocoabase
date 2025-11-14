// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmBiodiversityCredits
 * @dev Onchain system for earning and trading biodiversity credits
 */
contract FarmBiodiversityCredits is Ownable {
    struct BiodiversityCredit {
        uint256 plantationId;
        uint256 creditAmount;
        uint256 issueDate;
        string biodiversityType;
        address issuer;
        bool verified;
        uint256 value;
    }

    mapping(uint256 => BiodiversityCredit) public credits;
    mapping(address => uint256[]) public creditsByOwner;
    uint256 private _creditIdCounter;

    event BiodiversityCreditIssued(
        uint256 indexed creditId,
        address indexed owner,
        uint256 creditAmount
    );

    event BiodiversityCreditVerified(
        uint256 indexed creditId,
        uint256 value
    );

    constructor() Ownable(msg.sender) {}

    function issueCredit(
        uint256 plantationId,
        uint256 creditAmount,
        string memory biodiversityType
    ) public returns (uint256) {
        uint256 creditId = _creditIdCounter++;
        credits[creditId] = BiodiversityCredit({
            plantationId: plantationId,
            creditAmount: creditAmount,
            issueDate: block.timestamp,
            biodiversityType: biodiversityType,
            issuer: msg.sender,
            verified: false,
            value: 0
        });

        creditsByOwner[msg.sender].push(creditId);

        emit BiodiversityCreditIssued(creditId, msg.sender, creditAmount);
        return creditId;
    }

    function verifyCredit(uint256 creditId, uint256 value) public onlyOwner {
        require(!credits[creditId].verified, "Already verified");
        credits[creditId].verified = true;
        credits[creditId].value = value;

        emit BiodiversityCreditVerified(creditId, value);
    }

    function getCredit(uint256 creditId) public view returns (BiodiversityCredit memory) {
        return credits[creditId];
    }
}

