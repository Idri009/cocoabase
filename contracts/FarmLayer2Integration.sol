// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLayer2Integration
 * @dev Layer 2 scaling solution integration
 */
contract FarmLayer2Integration is Ownable {
    struct L2Transaction {
        uint256 txId;
        address user;
        bytes data;
        uint256 l2ChainId;
        bool processed;
    }

    mapping(uint256 => L2Transaction) public l2Transactions;
    mapping(uint256 => bool) public supportedL2Chains;
    mapping(address => uint256[]) public transactionsByUser;
    uint256 private _txIdCounter;

    event L2TransactionCreated(
        uint256 indexed txId,
        address indexed user,
        uint256 l2ChainId
    );
    event L2TransactionProcessed(uint256 indexed txId);
    event L2ChainSupported(uint256 indexed chainId, bool supported);

    constructor() Ownable(msg.sender) {}

    function addSupportedL2Chain(uint256 chainId) public onlyOwner {
        supportedL2Chains[chainId] = true;
        emit L2ChainSupported(chainId, true);
    }

    function createL2Transaction(
        uint256 l2ChainId,
        bytes memory data
    ) public returns (uint256) {
        require(supportedL2Chains[l2ChainId], "L2 chain not supported");
        uint256 txId = _txIdCounter++;
        l2Transactions[txId] = L2Transaction({
            txId: txId,
            user: msg.sender,
            data: data,
            l2ChainId: l2ChainId,
            processed: false
        });
        transactionsByUser[msg.sender].push(txId);
        emit L2TransactionCreated(txId, msg.sender, l2ChainId);
        return txId;
    }

    function processL2Transaction(uint256 txId) public onlyOwner {
        L2Transaction storage tx_ = l2Transactions[txId];
        require(!tx_.processed, "Already processed");
        tx_.processed = true;
        emit L2TransactionProcessed(txId);
    }
}


