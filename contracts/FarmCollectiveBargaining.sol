// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCollectiveBargaining
 * @dev Collective bargaining and negotiation system for farmer groups
 */
contract FarmCollectiveBargaining is Ownable {
    struct Negotiation {
        uint256 negotiationId;
        address groupLeader;
        address buyer;
        string productType;
        uint256 proposedPrice;
        uint256 minimumPrice;
        bool accepted;
        uint256 deadline;
    }

    mapping(uint256 => Negotiation) public negotiations;
    mapping(address => uint256[]) public negotiationsByGroup;
    uint256 private _negotiationIdCounter;

    event NegotiationStarted(
        uint256 indexed negotiationId,
        address indexed groupLeader,
        address indexed buyer
    );

    event NegotiationAccepted(
        uint256 indexed negotiationId,
        uint256 finalPrice
    );

    constructor() Ownable(msg.sender) {}

    function startNegotiation(
        address buyer,
        string memory productType,
        uint256 proposedPrice,
        uint256 minimumPrice,
        uint256 deadline
    ) public returns (uint256) {
        uint256 negotiationId = _negotiationIdCounter++;
        negotiations[negotiationId] = Negotiation({
            negotiationId: negotiationId,
            groupLeader: msg.sender,
            buyer: buyer,
            productType: productType,
            proposedPrice: proposedPrice,
            minimumPrice: minimumPrice,
            accepted: false,
            deadline: deadline
        });

        negotiationsByGroup[msg.sender].push(negotiationId);
        emit NegotiationStarted(negotiationId, msg.sender, buyer);
        return negotiationId;
    }

    function acceptNegotiation(uint256 negotiationId) public {
        require(negotiations[negotiationId].buyer == msg.sender, "Not authorized");
        require(block.timestamp <= negotiations[negotiationId].deadline, "Deadline passed");
        require(!negotiations[negotiationId].accepted, "Already accepted");
        require(negotiations[negotiationId].proposedPrice >= negotiations[negotiationId].minimumPrice, "Price too low");
        negotiations[negotiationId].accepted = true;
        emit NegotiationAccepted(negotiationId, negotiations[negotiationId].proposedPrice);
    }

    function getNegotiation(uint256 negotiationId) public view returns (Negotiation memory) {
        return negotiations[negotiationId];
    }
}
