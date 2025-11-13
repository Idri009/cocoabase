// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmInsurancePolicy
 * @dev Onchain insurance policy management
 */
contract FarmInsurancePolicy is Ownable {
    struct InsurancePolicy {
        uint256 policyId;
        address policyholder;
        uint256 coverageAmount;
        uint256 premium;
        uint256 startDate;
        uint256 endDate;
        string coverageType;
        bool active;
        uint256 claimsCount;
    }

    mapping(uint256 => InsurancePolicy) public policies;
    mapping(address => uint256[]) public policiesByHolder;
    uint256 private _policyIdCounter;

    event PolicyCreated(
        uint256 indexed policyId,
        address indexed policyholder,
        uint256 coverageAmount
    );

    event ClaimFiled(
        uint256 indexed policyId,
        uint256 claimAmount,
        string reason
    );

    constructor() Ownable(msg.sender) {}

    function createPolicy(
        address policyholder,
        uint256 coverageAmount,
        uint256 premium,
        uint256 startDate,
        uint256 endDate,
        string memory coverageType
    ) public onlyOwner returns (uint256) {
        uint256 policyId = _policyIdCounter++;
        policies[policyId] = InsurancePolicy({
            policyId: policyId,
            policyholder: policyholder,
            coverageAmount: coverageAmount,
            premium: premium,
            startDate: startDate,
            endDate: endDate,
            coverageType: coverageType,
            active: true,
            claimsCount: 0
        });

        policiesByHolder[policyholder].push(policyId);

        emit PolicyCreated(policyId, policyholder, coverageAmount);
        return policyId;
    }

    function fileClaim(uint256 policyId, uint256 claimAmount, string memory reason) public {
        InsurancePolicy storage policy = policies[policyId];
        require(policy.policyholder == msg.sender, "Not the policyholder");
        require(policy.active, "Policy not active");
        require(block.timestamp >= policy.startDate && block.timestamp <= policy.endDate, "Outside coverage period");

        policy.claimsCount++;

        emit ClaimFiled(policyId, claimAmount, reason);
    }

    function getPolicy(uint256 policyId) public view returns (InsurancePolicy memory) {
        return policies[policyId];
    }

    function getPoliciesByHolder(address holder) public view returns (uint256[] memory) {
        return policiesByHolder[holder];
    }
}

