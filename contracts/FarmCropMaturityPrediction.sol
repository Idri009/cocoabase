// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropMaturityPrediction
 * @dev Onchain crop maturity prediction using historical data
 */
contract FarmCropMaturityPrediction is Ownable {
    struct MaturityPrediction {
        uint256 predictionId;
        address farmer;
        string fieldId;
        string cropType;
        uint256 plantingDate;
        uint256 predictedMaturityDate;
        uint256 confidenceLevel;
        uint256 predictionDate;
        string factors;
    }

    mapping(uint256 => MaturityPrediction) public predictions;
    mapping(address => uint256[]) public predictionsByFarmer;
    uint256 private _predictionIdCounter;

    event PredictionRecorded(
        uint256 indexed predictionId,
        address indexed farmer,
        string fieldId,
        uint256 predictedMaturityDate
    );

    constructor() Ownable(msg.sender) {}

    function recordPrediction(
        string memory fieldId,
        string memory cropType,
        uint256 plantingDate,
        uint256 predictedMaturityDate,
        uint256 confidenceLevel,
        string memory factors
    ) public returns (uint256) {
        uint256 predictionId = _predictionIdCounter++;
        predictions[predictionId] = MaturityPrediction({
            predictionId: predictionId,
            farmer: msg.sender,
            fieldId: fieldId,
            cropType: cropType,
            plantingDate: plantingDate,
            predictedMaturityDate: predictedMaturityDate,
            confidenceLevel: confidenceLevel,
            predictionDate: block.timestamp,
            factors: factors
        });

        predictionsByFarmer[msg.sender].push(predictionId);
        emit PredictionRecorded(predictionId, msg.sender, fieldId, predictedMaturityDate);
        return predictionId;
    }

    function getPrediction(uint256 predictionId) public view returns (MaturityPrediction memory) {
        return predictions[predictionId];
    }
}
