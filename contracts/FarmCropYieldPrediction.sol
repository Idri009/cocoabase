// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropYieldPrediction
 * @dev Onchain crop yield prediction using historical data and AI models
 */
contract FarmCropYieldPrediction is Ownable {
    struct YieldPrediction {
        uint256 plantationId;
        uint256 predictedYield;
        uint256 confidence;
        uint256 predictionDate;
        string cropType;
        address predictor;
        bool verified;
        uint256 actualYield;
    }

    mapping(uint256 => YieldPrediction) public predictions;
    mapping(address => uint256[]) public predictionsByOwner;
    uint256 private _predictionIdCounter;

    event YieldPredictionCreated(
        uint256 indexed predictionId,
        address indexed owner,
        uint256 plantationId,
        uint256 predictedYield
    );

    event YieldPredictionVerified(
        uint256 indexed predictionId,
        uint256 actualYield,
        uint256 accuracy
    );

    constructor() Ownable(msg.sender) {}

    function createPrediction(
        uint256 plantationId,
        uint256 predictedYield,
        uint256 confidence,
        string memory cropType
    ) public returns (uint256) {
        uint256 predictionId = _predictionIdCounter++;
        predictions[predictionId] = YieldPrediction({
            plantationId: plantationId,
            predictedYield: predictedYield,
            confidence: confidence,
            predictionDate: block.timestamp,
            cropType: cropType,
            predictor: msg.sender,
            verified: false,
            actualYield: 0
        });

        predictionsByOwner[msg.sender].push(predictionId);

        emit YieldPredictionCreated(predictionId, msg.sender, plantationId, predictedYield);
        return predictionId;
    }

    function verifyPrediction(uint256 predictionId, uint256 actualYield) public {
        require(!predictions[predictionId].verified, "Already verified");
        predictions[predictionId].verified = true;
        predictions[predictionId].actualYield = actualYield;

        uint256 accuracy = calculateAccuracy(
            predictions[predictionId].predictedYield,
            actualYield
        );

        emit YieldPredictionVerified(predictionId, actualYield, accuracy);
    }

    function calculateAccuracy(uint256 predicted, uint256 actual) private pure returns (uint256) {
        if (actual == 0) return 0;
        uint256 diff = predicted > actual ? predicted - actual : actual - predicted;
        return ((actual - diff) * 100) / actual;
    }

    function getPrediction(uint256 predictionId) public view returns (YieldPrediction memory) {
        return predictions[predictionId];
    }
}

