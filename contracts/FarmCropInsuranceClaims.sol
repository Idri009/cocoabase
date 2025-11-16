// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropInsuranceClaims
 * @dev Insurance claims processing system
 */
contract FarmCropInsuranceClaims is Ownable {
    struct Claim {
        uint256 claimId;
        address farmer;
        uint256 policyId;
        uint256 cropId;
        uint256 claimAmount;
        string reason;
        bool approved;
        bool paid;
        uint256 submissionDate;
    }

    mapping(uint256 => Claim) public claims;
    mapping(address => uint256[]) public claimsByFarmer;
    mapping(uint256 => uint256[]) public claimsByPolicy;
    mapping(address => bool) public isAdjuster;
    uint256 private _claimIdCounter;

    event ClaimSubmitted(uint256 indexed claimId, address indexed farmer, uint256 amount);
    event ClaimApproved(uint256 indexed claimId, address indexed adjuster);
    event ClaimPaid(uint256 indexed claimId, uint256 amount);

    constructor() Ownable(msg.sender) {
        isAdjuster[msg.sender] = true;
    }

    function addAdjuster(address adjuster) public onlyOwner {
        isAdjuster[adjuster] = true;
    }

    function submitClaim(
        uint256 policyId,
        uint256 cropId,
        uint256 claimAmount,
        string memory reason
    ) public returns (uint256) {
        require(claimAmount > 0, "Invalid amount");
        uint256 claimId = _claimIdCounter++;
        claims[claimId] = Claim({
            claimId: claimId,
            farmer: msg.sender,
            policyId: policyId,
            cropId: cropId,
            claimAmount: claimAmount,
            reason: reason,
            approved: false,
            paid: false,
            submissionDate: block.timestamp
        });
        claimsByFarmer[msg.sender].push(claimId);
        claimsByPolicy[policyId].push(claimId);
        emit ClaimSubmitted(claimId, msg.sender, claimAmount);
        return claimId;
    }

    function approveClaim(uint256 claimId) public {
        require(isAdjuster[msg.sender], "Not an adjuster");
        require(!claims[claimId].approved, "Already approved");
        claims[claimId].approved = true;
        emit ClaimApproved(claimId, msg.sender);
    }

    function payClaim(uint256 claimId) public payable {
        Claim storage claim = claims[claimId];
        require(claim.approved, "Not approved");
        require(!claim.paid, "Already paid");
        require(msg.value >= claim.claimAmount, "Insufficient payment");
        claim.paid = true;
        payable(claim.farmer).transfer(claim.claimAmount);
        emit ClaimPaid(claimId, claim.claimAmount);
    }
}
