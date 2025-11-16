// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmFarmerReputation
 * @dev Farmer reputation system based on performance
 */
contract FarmFarmerReputation is Ownable {
    struct Reputation {
        address farmer;
        uint256 score;
        uint256 totalRatings;
        uint256 positiveRatings;
        uint256 lastUpdated;
    }

    mapping(address => Reputation) public reputations;
    mapping(address => mapping(address => bool)) public hasRated;

    event ReputationUpdated(address indexed farmer, uint256 newScore);
    event FarmerRated(address indexed farmer, address indexed rater, bool positive);

    constructor() Ownable(msg.sender) {}

    function rateFarmer(address farmer, bool positive) public {
        require(farmer != msg.sender, "Cannot rate yourself");
        require(!hasRated[farmer][msg.sender], "Already rated");
        
        hasRated[farmer][msg.sender] = true;
        Reputation storage rep = reputations[farmer];
        if (rep.farmer == address(0)) {
            rep.farmer = farmer;
            rep.score = 1000;
        }
        
        rep.totalRatings++;
        if (positive) {
            rep.positiveRatings++;
            rep.score += 10;
        } else {
            rep.score = rep.score > 10 ? rep.score - 10 : 0;
        }
        rep.lastUpdated = block.timestamp;
        emit FarmerRated(farmer, msg.sender, positive);
        emit ReputationUpdated(farmer, rep.score);
    }

    function getReputation(address farmer) public view returns (Reputation memory) {
        return reputations[farmer];
    }
}
