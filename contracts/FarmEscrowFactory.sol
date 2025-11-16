// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmEscrowFactory
 * @dev Factory contract for creating escrow agreements
 */
contract FarmEscrowFactory is Ownable {
    struct Escrow {
        uint256 escrowId;
        address payer;
        address payee;
        uint256 amount;
        bytes32 conditions;
        bool released;
        bool refunded;
    }

    mapping(uint256 => Escrow) public escrows;
    mapping(address => uint256[]) public escrowsByPayer;
    mapping(address => uint256[]) public escrowsByPayee;
    uint256 private _escrowIdCounter;

    event EscrowCreated(
        uint256 indexed escrowId,
        address indexed payer,
        address indexed payee,
        uint256 amount
    );
    event EscrowReleased(uint256 indexed escrowId);
    event EscrowRefunded(uint256 indexed escrowId);

    constructor() Ownable(msg.sender) {}

    function createEscrow(
        address payee,
        bytes32 conditions
    ) public payable returns (uint256) {
        require(msg.value > 0, "Amount must be greater than 0");
        require(payee != address(0), "Invalid payee");
        
        uint256 escrowId = _escrowIdCounter++;
        escrows[escrowId] = Escrow({
            escrowId: escrowId,
            payer: msg.sender,
            payee: payee,
            amount: msg.value,
            conditions: conditions,
            released: false,
            refunded: false
        });
        escrowsByPayer[msg.sender].push(escrowId);
        escrowsByPayee[payee].push(escrowId);
        emit EscrowCreated(escrowId, msg.sender, payee, msg.value);
        return escrowId;
    }

    function releaseEscrow(uint256 escrowId) public {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.payer == msg.sender || escrow.payee == msg.sender, "Not authorized");
        require(!escrow.released && !escrow.refunded, "Already processed");
        
        escrow.released = true;
        payable(escrow.payee).transfer(escrow.amount);
        emit EscrowReleased(escrowId);
    }

    function refundEscrow(uint256 escrowId) public {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.payer == msg.sender, "Not the payer");
        require(!escrow.released && !escrow.refunded, "Already processed");
        
        escrow.refunded = true;
        payable(escrow.payer).transfer(escrow.amount);
        emit EscrowRefunded(escrowId);
    }
}


