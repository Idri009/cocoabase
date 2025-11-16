// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmProposalManagement
 * @dev Onchain proposal submission and execution system
 */
contract FarmProposalManagement is Ownable {
    struct Proposal {
        uint256 proposalId;
        address proposer;
        string title;
        string description;
        bytes calldataData;
        address targetContract;
        uint256 submissionTime;
        uint256 executionTime;
        bool executed;
        uint256 approvalCount;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public approvals;
    mapping(address => bool) public isApprover;
    uint256 private _proposalIdCounter;
    uint256 public requiredApprovals = 3;

    event ProposalSubmitted(uint256 indexed proposalId, address indexed proposer);
    event ProposalApproved(uint256 indexed proposalId, address indexed approver);
    event ProposalExecuted(uint256 indexed proposalId);

    constructor() Ownable(msg.sender) {}

    function addApprover(address approver) public onlyOwner {
        isApprover[approver] = true;
    }

    function submitProposal(
        string memory title,
        string memory description,
        address targetContract,
        bytes memory calldataData
    ) public returns (uint256) {
        uint256 proposalId = _proposalIdCounter++;
        proposals[proposalId] = Proposal({
            proposalId: proposalId,
            proposer: msg.sender,
            title: title,
            description: description,
            calldataData: calldataData,
            targetContract: targetContract,
            submissionTime: block.timestamp,
            executionTime: 0,
            executed: false,
            approvalCount: 0
        });
        emit ProposalSubmitted(proposalId, msg.sender);
        return proposalId;
    }

    function approveProposal(uint256 proposalId) public {
        require(isApprover[msg.sender], "Not an approver");
        require(!approvals[proposalId][msg.sender], "Already approved");
        require(!proposals[proposalId].executed, "Already executed");
        
        approvals[proposalId][msg.sender] = true;
        proposals[proposalId].approvalCount++;
        emit ProposalApproved(proposalId, msg.sender);
    }

    function executeProposal(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Already executed");
        require(proposal.approvalCount >= requiredApprovals, "Insufficient approvals");
        
        proposal.executed = true;
        proposal.executionTime = block.timestamp;
        (bool success, ) = proposal.targetContract.call(proposal.calldataData);
        require(success, "Execution failed");
        emit ProposalExecuted(proposalId);
    }
}


