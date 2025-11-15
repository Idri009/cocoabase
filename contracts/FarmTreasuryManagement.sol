// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmTreasuryManagement
 * @dev Multi-sig treasury management for farmer collectives
 */
contract FarmTreasuryManagement is Ownable {
    struct Transaction {
        uint256 txId;
        address to;
        uint256 amount;
        bytes data;
        bool executed;
        uint256 approvalCount;
    }

    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public approvals;
    mapping(address => bool) public isSigner;
    uint256 private _txIdCounter;
    uint256 public requiredSignatures = 2;

    event TransactionProposed(uint256 indexed txId, address indexed proposer);
    event TransactionApproved(uint256 indexed txId, address indexed signer);
    event TransactionExecuted(uint256 indexed txId);

    constructor() Ownable(msg.sender) {
        isSigner[msg.sender] = true;
    }

    function addSigner(address signer) public onlyOwner {
        isSigner[signer] = true;
    }

    function proposeTransaction(
        address to,
        uint256 amount,
        bytes memory data
    ) public returns (uint256) {
        require(isSigner[msg.sender], "Not a signer");
        uint256 txId = _txIdCounter++;
        transactions[txId] = Transaction({
            txId: txId,
            to: to,
            amount: amount,
            data: data,
            executed: false,
            approvalCount: 0
        });
        emit TransactionProposed(txId, msg.sender);
        return txId;
    }

    function approveTransaction(uint256 txId) public {
        require(isSigner[msg.sender], "Not a signer");
        require(!approvals[txId][msg.sender], "Already approved");
        require(!transactions[txId].executed, "Already executed");
        
        approvals[txId][msg.sender] = true;
        transactions[txId].approvalCount++;
        emit TransactionApproved(txId, msg.sender);
    }

    function executeTransaction(uint256 txId) public {
        Transaction storage tx = transactions[txId];
        require(!tx.executed, "Already executed");
        require(tx.approvalCount >= requiredSignatures, "Insufficient signatures");
        require(address(this).balance >= tx.amount, "Insufficient balance");
        
        tx.executed = true;
        (bool success, ) = tx.to.call{value: tx.amount}(tx.data);
        require(success, "Execution failed");
        emit TransactionExecuted(txId);
    }

    receive() external payable {}
}

