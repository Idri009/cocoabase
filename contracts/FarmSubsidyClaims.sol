// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSubsidyClaims
 * @dev Onchain subsidy claims management
 */
contract FarmSubsidyClaims is Ownable {
    struct SubsidyClaim {
        uint256 claimId;
        address claimant;
        uint256 amount;
        string subsidyType;
        string reason;
        uint256 submissionDate;
        bool approved;
        bool paid;
    }

    mapping(uint256 => SubsidyClaim) public claims;
    mapping(address => uint256[]) public claimsByClaimant;
    uint256 private _claimIdCounter;

    event ClaimSubmitted(
        uint256 indexed claimId,
        address indexed claimant,
        uint256 amount
    );

    event ClaimApproved(uint256 indexed claimId);
    event ClaimPaid(uint256 indexed claimId);

    constructor() Ownable(msg.sender) {}

    function submitClaim(
        uint256 amount,
        string memory subsidyType,
        string memory reason
    ) public returns (uint256) {
        uint256 claimId = _claimIdCounter++;
        claims[claimId] = SubsidyClaim({
            claimId: claimId,
            claimant: msg.sender,
            amount: amount,
            subsidyType: subsidyType,
            reason: reason,
            submissionDate: block.timestamp,
            approved: false,
            paid: false
        });

        claimsByClaimant[msg.sender].push(claimId);

        emit ClaimSubmitted(claimId, msg.sender, amount);
        return claimId;
    }

    function approveClaim(uint256 claimId) public onlyOwner {
        require(!claims[claimId].approved, "Already approved");
        claims[claimId].approved = true;
        emit ClaimApproved(claimId);
    }

    function markAsPaid(uint256 claimId) public onlyOwner {
        require(claims[claimId].approved, "Not approved");
        require(!claims[claimId].paid, "Already paid");
        claims[claimId].paid = true;
        emit ClaimPaid(claimId);
    }

    function getClaim(uint256 claimId) public view returns (SubsidyClaim memory) {
        return claims[claimId];
    }

    function getClaimsByClaimant(address claimant) public view returns (uint256[] memory) {
        return claimsByClaimant[claimant];
    }
}

