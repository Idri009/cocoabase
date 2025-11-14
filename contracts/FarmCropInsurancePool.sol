// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropInsurancePool
 * @dev Onchain crop insurance pooling system
 */
contract FarmCropInsurancePool is Ownable {
    struct PoolMember {
        address farmer;
        uint256 contribution;
        uint256 coverageAmount;
        bool isActive;
        uint256 joinDate;
    }

    struct Claim {
        uint256 claimId;
        address farmer;
        uint256 claimAmount;
        string reason;
        uint256 claimDate;
        bool approved;
        bool processed;
    }

    mapping(address => PoolMember) public poolMembers;
    mapping(uint256 => Claim) public claims;
    address[] public memberList;
    uint256 private _claimIdCounter;
    uint256 public totalPoolFunds;
    uint256 public minimumContribution;

    event PoolJoined(address indexed farmer, uint256 contribution, uint256 coverageAmount);
    event ClaimSubmitted(uint256 indexed claimId, address indexed farmer, uint256 claimAmount);
    event ClaimApproved(uint256 indexed claimId, address indexed farmer, uint256 claimAmount);
    event ClaimProcessed(uint256 indexed claimId, address indexed farmer, uint256 claimAmount);

    constructor(uint256 _minimumContribution) Ownable(msg.sender) {
        minimumContribution = _minimumContribution;
    }

    function joinPool(uint256 coverageAmount) public payable {
        require(msg.value >= minimumContribution, "Insufficient contribution");
        require(!poolMembers[msg.sender].isActive, "Already a member");

        poolMembers[msg.sender] = PoolMember({
            farmer: msg.sender,
            contribution: msg.value,
            coverageAmount: coverageAmount,
            isActive: true,
            joinDate: block.timestamp
        });

        memberList.push(msg.sender);
        totalPoolFunds += msg.value;

        emit PoolJoined(msg.sender, msg.value, coverageAmount);
    }

    function submitClaim(
        uint256 claimAmount,
        string memory reason
    ) public returns (uint256) {
        require(poolMembers[msg.sender].isActive, "Not a pool member");
        require(claimAmount <= poolMembers[msg.sender].coverageAmount, "Exceeds coverage");

        uint256 claimId = _claimIdCounter++;
        claims[claimId] = Claim({
            claimId: claimId,
            farmer: msg.sender,
            claimAmount: claimAmount,
            reason: reason,
            claimDate: block.timestamp,
            approved: false,
            processed: false
        });

        emit ClaimSubmitted(claimId, msg.sender, claimAmount);
        return claimId;
    }

    function approveClaim(uint256 claimId) public onlyOwner {
        require(!claims[claimId].approved, "Already approved");
        require(totalPoolFunds >= claims[claimId].claimAmount, "Insufficient pool funds");

        claims[claimId].approved = true;
        emit ClaimApproved(claimId, claims[claimId].farmer, claims[claimId].claimAmount);
    }

    function processClaim(uint256 claimId) public onlyOwner {
        require(claims[claimId].approved, "Claim not approved");
        require(!claims[claimId].processed, "Already processed");

        claims[claimId].processed = true;
        totalPoolFunds -= claims[claimId].claimAmount;

        payable(claims[claimId].farmer).transfer(claims[claimId].claimAmount);

        emit ClaimProcessed(claimId, claims[claimId].farmer, claims[claimId].claimAmount);
    }

    function getPoolMember(address farmer) public view returns (PoolMember memory) {
        return poolMembers[farmer];
    }

    function getClaim(uint256 claimId) public view returns (Claim memory) {
        return claims[claimId];
    }

    function getMemberCount() public view returns (uint256) {
        return memberList.length;
    }
}

