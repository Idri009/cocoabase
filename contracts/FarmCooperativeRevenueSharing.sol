// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCooperativeRevenueSharing
 * @dev Automated revenue sharing among cooperative members
 */
contract FarmCooperativeRevenueSharing is Ownable {
    struct MemberShare {
        address member;
        uint256 sharePercentage;
        uint256 totalReceived;
    }

    struct RevenueDistribution {
        uint256 distributionId;
        uint256 totalRevenue;
        uint256 distributionDate;
        bool processed;
    }

    mapping(address => MemberShare) public memberShares;
    mapping(uint256 => RevenueDistribution) public distributions;
    address[] public members;
    uint256 private _distributionIdCounter;

    event RevenueDistributed(
        uint256 indexed distributionId,
        address indexed member,
        uint256 amount
    );

    constructor() Ownable(msg.sender) {}

    function addMember(address member, uint256 sharePercentage) public onlyOwner {
        require(memberShares[member].member == address(0), "Member exists");
        memberShares[member] = MemberShare({
            member: member,
            sharePercentage: sharePercentage,
            totalReceived: 0
        });
        members.push(member);
    }

    function distributeRevenue() public payable onlyOwner {
        require(msg.value > 0, "No revenue to distribute");
        uint256 distributionId = _distributionIdCounter++;
        distributions[distributionId] = RevenueDistribution({
            distributionId: distributionId,
            totalRevenue: msg.value,
            distributionDate: block.timestamp,
            processed: true
        });

        for (uint256 i = 0; i < members.length; i++) {
            address member = members[i];
            uint256 amount = (msg.value * memberShares[member].sharePercentage) / 10000;
            memberShares[member].totalReceived += amount;
            payable(member).transfer(amount);
            emit RevenueDistributed(distributionId, member, amount);
        }
    }

    function getMemberShare(address member) public view returns (MemberShare memory) {
        return memberShares[member];
    }
}
