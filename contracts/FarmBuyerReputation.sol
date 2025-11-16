// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmBuyerReputation
 * @dev Buyer reputation and payment reliability tracking
 */
contract FarmBuyerReputation is Ownable {
    struct BuyerReputation {
        address buyer;
        uint256 score;
        uint256 totalTransactions;
        uint256 onTimePayments;
        uint256 totalPayments;
        uint256 lastUpdated;
    }

    mapping(address => BuyerReputation) public buyerReputations;
    mapping(address => mapping(address => bool)) public hasRatedBuyer;

    event BuyerRated(address indexed buyer, address indexed rater, uint256 score);
    event ReputationUpdated(address indexed buyer, uint256 newScore);

    constructor() Ownable(msg.sender) {}

    function rateBuyer(address buyer, uint256 score) public {
        require(score >= 1 && score <= 5, "Invalid score");
        require(buyer != msg.sender, "Cannot rate yourself");
        require(!hasRatedBuyer[buyer][msg.sender], "Already rated");
        
        hasRatedBuyer[buyer][msg.sender] = true;
        BuyerReputation storage rep = buyerReputations[buyer];
        if (rep.buyer == address(0)) {
            rep.buyer = buyer;
            rep.score = 1000;
        }
        
        rep.totalTransactions++;
        rep.score = ((rep.score * (rep.totalTransactions - 1)) + (score * 200)) / rep.totalTransactions;
        rep.lastUpdated = block.timestamp;
        emit BuyerRated(buyer, msg.sender, score);
        emit ReputationUpdated(buyer, rep.score);
    }

    function recordPayment(address buyer, bool onTime) public {
        BuyerReputation storage rep = buyerReputations[buyer];
        if (rep.buyer == address(0)) {
            rep.buyer = buyer;
            rep.score = 1000;
        }
        rep.totalPayments++;
        if (onTime) {
            rep.onTimePayments++;
        }
    }

    function getBuyerReputation(address buyer) public view returns (BuyerReputation memory) {
        return buyerReputations[buyer];
    }
}
