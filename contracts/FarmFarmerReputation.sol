// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmFarmerReputation
 * @dev Onchain farmer reputation system based on performance
 */
contract FarmFarmerReputation is Ownable {
    struct ReputationScore {
        address farmer;
        uint256 qualityScore;
        uint256 deliveryScore;
        uint256 sustainabilityScore;
        uint256 overallReputation;
        uint256 totalTransactions;
        uint256 positiveReviews;
        uint256 negativeReviews;
    }

    struct Review {
        uint256 reviewId;
        address reviewer;
        address farmer;
        uint256 rating;
        string comment;
        uint256 timestamp;
    }

    mapping(address => ReputationScore) public reputations;
    mapping(uint256 => Review) public reviews;
    mapping(address => uint256[]) public reviewsByFarmer;
    uint256 private _reviewIdCounter;

    event ReviewSubmitted(
        uint256 indexed reviewId,
        address indexed reviewer,
        address indexed farmer,
        uint256 rating
    );

    constructor() Ownable(msg.sender) {}

    function submitReview(
        address farmer,
        uint256 rating,
        string memory comment
    ) public returns (uint256) {
        require(farmer != address(0), "Invalid farmer address");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        require(farmer != msg.sender, "Cannot review yourself");

        uint256 reviewId = _reviewIdCounter++;
        reviews[reviewId] = Review({
            reviewId: reviewId,
            reviewer: msg.sender,
            farmer: farmer,
            rating: rating,
            comment: comment,
            timestamp: block.timestamp
        });

        reviewsByFarmer[farmer].push(reviewId);

        if (reputations[farmer].totalTransactions == 0) {
            reputations[farmer] = ReputationScore({
                farmer: farmer,
                qualityScore: 0,
                deliveryScore: 0,
                sustainabilityScore: 0,
                overallReputation: 0,
                totalTransactions: 0,
                positiveReviews: 0,
                negativeReviews: 0
            });
        }

        ReputationScore storage rep = reputations[farmer];
        rep.totalTransactions++;
        if (rating >= 4) {
            rep.positiveReviews++;
        } else {
            rep.negativeReviews++;
        }
        rep.overallReputation = (rep.positiveReviews * 100) / rep.totalTransactions;

        emit ReviewSubmitted(reviewId, msg.sender, farmer, rating);
        return reviewId;
    }

    function updateQualityScore(address farmer, uint256 score) public onlyOwner {
        reputations[farmer].qualityScore = score;
        updateOverallReputation(farmer);
    }

    function updateDeliveryScore(address farmer, uint256 score) public onlyOwner {
        reputations[farmer].deliveryScore = score;
        updateOverallReputation(farmer);
    }

    function updateSustainabilityScore(address farmer, uint256 score) public onlyOwner {
        reputations[farmer].sustainabilityScore = score;
        updateOverallReputation(farmer);
    }

    function updateOverallReputation(address farmer) internal {
        ReputationScore storage rep = reputations[farmer];
        rep.overallReputation = (rep.qualityScore + rep.deliveryScore + rep.sustainabilityScore) / 3;
    }

    function getReputation(address farmer) public view returns (ReputationScore memory) {
        return reputations[farmer];
    }
}

