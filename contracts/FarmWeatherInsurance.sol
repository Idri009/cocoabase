// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWeatherInsurance
 * @dev Onchain weather-based insurance for agricultural risks
 */
contract FarmWeatherInsurance is Ownable {
    struct InsurancePolicy {
        uint256 plantationId;
        uint256 coverageAmount;
        uint256 premium;
        uint256 startDate;
        uint256 endDate;
        string weatherConditions;
        address policyholder;
        bool active;
        bool claimed;
    }

    mapping(uint256 => InsurancePolicy) public policies;
    mapping(address => uint256[]) public policiesByOwner;
    uint256 private _policyIdCounter;

    event InsurancePolicyCreated(
        uint256 indexed policyId,
        address indexed policyholder,
        uint256 coverageAmount
    );

    event InsuranceClaimFiled(
        uint256 indexed policyId,
        address indexed claimant,
        uint256 claimAmount
    );

    constructor() Ownable(msg.sender) {}

    function createPolicy(
        uint256 plantationId,
        uint256 coverageAmount,
        uint256 premium,
        uint256 endDate,
        string memory weatherConditions
    ) public returns (uint256) {
        uint256 policyId = _policyIdCounter++;
        policies[policyId] = InsurancePolicy({
            plantationId: plantationId,
            coverageAmount: coverageAmount,
            premium: premium,
            startDate: block.timestamp,
            endDate: endDate,
            weatherConditions: weatherConditions,
            policyholder: msg.sender,
            active: true,
            claimed: false
        });

        policiesByOwner[msg.sender].push(policyId);

        emit InsurancePolicyCreated(policyId, msg.sender, coverageAmount);
        return policyId;
    }

    function fileClaim(uint256 policyId, uint256 claimAmount) public {
        require(policies[policyId].active, "Policy not active");
        require(policies[policyId].policyholder == msg.sender, "Not policyholder");
        require(!policies[policyId].claimed, "Already claimed");
        require(claimAmount <= policies[policyId].coverageAmount, "Exceeds coverage");

        policies[policyId].claimed = true;
        policies[policyId].active = false;

        emit InsuranceClaimFiled(policyId, msg.sender, claimAmount);
    }

    function getPolicy(uint256 policyId) public view returns (InsurancePolicy memory) {
        return policies[policyId];
    }
}

