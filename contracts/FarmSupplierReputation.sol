// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSupplierReputation
 * @dev Onchain supplier reputation and rating system
 */
contract FarmSupplierReputation is Ownable {
    struct SupplierReputation {
        address supplier;
        uint256 reliabilityScore;
        uint256 qualityScore;
        uint256 priceScore;
        uint256 overallRating;
        uint256 totalOrders;
        uint256 onTimeDeliveries;
    }

    struct SupplierReview {
        uint256 reviewId;
        address reviewer;
        address supplier;
        uint256 rating;
        string comment;
        uint256 timestamp;
    }

    mapping(address => SupplierReputation) public reputations;
    mapping(uint256 => SupplierReview) public reviews;
    mapping(address => uint256[]) public reviewsBySupplier;
    uint256 private _reviewIdCounter;

    event ReviewSubmitted(
        uint256 indexed reviewId,
        address indexed reviewer,
        address indexed supplier,
        uint256 rating
    );

    constructor() Ownable(msg.sender) {}

    function submitReview(
        address supplier,
        uint256 rating,
        string memory comment
    ) public returns (uint256) {
        require(supplier != address(0), "Invalid supplier address");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        uint256 reviewId = _reviewIdCounter++;
        reviews[reviewId] = SupplierReview({
            reviewId: reviewId,
            reviewer: msg.sender,
            supplier: supplier,
            rating: rating,
            comment: comment,
            timestamp: block.timestamp
        });

        reviewsBySupplier[supplier].push(reviewId);

        if (reputations[supplier].totalOrders == 0) {
            reputations[supplier] = SupplierReputation({
                supplier: supplier,
                reliabilityScore: 0,
                qualityScore: 0,
                priceScore: 0,
                overallRating: 0,
                totalOrders: 0,
                onTimeDeliveries: 0
            });
        }

        SupplierReputation storage rep = reputations[supplier];
        rep.totalOrders++;
        rep.overallRating = ((rep.overallRating * (rep.totalOrders - 1)) + (rating * 20)) / rep.totalOrders;

        emit ReviewSubmitted(reviewId, msg.sender, supplier, rating);
        return reviewId;
    }

    function recordDelivery(address supplier, bool onTime) public onlyOwner {
        SupplierReputation storage rep = reputations[supplier];
        if (onTime) {
            rep.onTimeDeliveries++;
        }
        rep.reliabilityScore = (rep.onTimeDeliveries * 100) / rep.totalOrders;
    }

    function getReputation(address supplier) public view returns (SupplierReputation memory) {
        return reputations[supplier];
    }
}

