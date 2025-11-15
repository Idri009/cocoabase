// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmOnchainReputation
 * @dev Onchain farmer reputation scoring based on transaction history and performance
 */
contract FarmOnchainReputation is Ownable {
    struct ReputationScore {
        address farmer;
        uint256 overallScore;
        uint256 transactionCount;
        uint256 qualityScore;
        uint256 sustainabilityScore;
        uint256 reliabilityScore;
        uint256 lastUpdated;
    }

    mapping(address => ReputationScore) public reputationScores;
    mapping(address => uint256[]) public transactionsByFarmer;

    event ReputationUpdated(
        address indexed farmer,
        uint256 overallScore
    );

    event TransactionRecorded(
        address indexed farmer,
        uint256 transactionId,
        string transactionType
    );

    uint256 private _transactionIdCounter;

    constructor() Ownable(msg.sender) {}

    function recordTransaction(
        address farmer,
        string memory transactionType,
        uint256 qualityScore,
        uint256 sustainabilityScore,
        uint256 reliabilityScore
    ) public onlyOwner returns (uint256) {
        uint256 transactionId = _transactionIdCounter++;
        transactionsByFarmer[farmer].push(transactionId);

        ReputationScore storage score = reputationScores[farmer];
        if (score.farmer == address(0)) {
            score.farmer = farmer;
        }

        score.transactionCount++;
        score.qualityScore = (score.qualityScore + qualityScore) / 2;
        score.sustainabilityScore = (score.sustainabilityScore + sustainabilityScore) / 2;
        score.reliabilityScore = (score.reliabilityScore + reliabilityScore) / 2;
        score.overallScore = (score.qualityScore + score.sustainabilityScore + score.reliabilityScore) / 3;
        score.lastUpdated = block.timestamp;

        emit TransactionRecorded(farmer, transactionId, transactionType);
        emit ReputationUpdated(farmer, score.overallScore);
        return transactionId;
    }

    function updateReputation(
        address farmer,
        uint256 qualityScore,
        uint256 sustainabilityScore,
        uint256 reliabilityScore
    ) public onlyOwner {
        ReputationScore storage score = reputationScores[farmer];
        require(score.farmer != address(0), "Farmer not found");
        score.qualityScore = qualityScore;
        score.sustainabilityScore = sustainabilityScore;
        score.reliabilityScore = reliabilityScore;
        score.overallScore = (qualityScore + sustainabilityScore + reliabilityScore) / 3;
        score.lastUpdated = block.timestamp;
        emit ReputationUpdated(farmer, score.overallScore);
    }

    function getReputation(address farmer) public view returns (ReputationScore memory) {
        return reputationScores[farmer];
    }
}
