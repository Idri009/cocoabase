// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmBuyerReputation
 * @dev Onchain buyer reputation and payment reliability tracking
 */
contract FarmBuyerReputation is Ownable {
    struct BuyerReputation {
        address buyer;
        uint256 paymentReliability;
        uint256 transactionCount;
        uint256 onTimePayments;
        uint256 totalSpent;
        uint256 overallRating;
    }

    struct BuyerReview {
        uint256 reviewId;
        address reviewer;
        address buyer;
        uint256 rating;
        string comment;
        uint256 timestamp;
    }

    mapping(address => BuyerReputation) public reputations;
    mapping(uint256 => BuyerReview) public reviews;
    mapping(address => uint256[]) public reviewsByBuyer;
    uint256 private _reviewIdCounter;

    event ReviewSubmitted(
        uint256 indexed reviewId,
        address indexed reviewer,
        address indexed buyer,
        uint256 rating
    );

    constructor() Ownable(msg.sender) {}

    function submitReview(
        address buyer,
        uint256 rating,
        string memory comment
    ) public returns (uint256) {
        require(buyer != address(0), "Invalid buyer address");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        uint256 reviewId = _reviewIdCounter++;
        reviews[reviewId] = BuyerReview({
            reviewId: reviewId,
            reviewer: msg.sender,
            buyer: buyer,
            rating: rating,
            comment: comment,
            timestamp: block.timestamp
        });

        reviewsByBuyer[buyer].push(reviewId);

        if (reputations[buyer].transactionCount == 0) {
            reputations[buyer] = BuyerReputation({
                buyer: buyer,
                paymentReliability: 0,
                transactionCount: 0,
                onTimePayments: 0,
                totalSpent: 0,
                overallRating: 0
            });
        }

        BuyerReputation storage rep = reputations[buyer];
        rep.transactionCount++;
        rep.overallRating = ((rep.overallRating * (rep.transactionCount - 1)) + (rating * 20)) / rep.transactionCount;

        emit ReviewSubmitted(reviewId, msg.sender, buyer, rating);
        return reviewId;
    }

    function recordPayment(address buyer, uint256 amount, bool onTime) public onlyOwner {
        BuyerReputation storage rep = reputations[buyer];
        rep.transactionCount++;
        rep.totalSpent += amount;
        if (onTime) {
            rep.onTimePayments++;
        }
        rep.paymentReliability = (rep.onTimePayments * 100) / rep.transactionCount;
    }

    function getReputation(address buyer) public view returns (BuyerReputation memory) {
        return reputations[buyer];
    }
}

