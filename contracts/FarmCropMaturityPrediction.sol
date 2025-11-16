// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropMaturityPrediction
 * @dev Predict crop maturity dates using onchain data
 */
contract FarmCropMaturityPrediction is Ownable {
    struct MaturityPrediction {
        uint256 predictionId;
        address farmer;
        string cropType;
        uint256 plantingDate;
        uint256 predictedMaturityDate;
        uint256 confidenceLevel;
        uint256 actualMaturityDate;
    }

    mapping(uint256 => MaturityPrediction) public predictions;
    mapping(address => uint256[]) public predictionsByFarmer;
    uint256 private _predictionIdCounter;

    event PredictionCreated(
        uint256 indexed predictionId,
        address indexed farmer,
        uint256 predictedMaturityDate
    );

    event MaturityConfirmed(
        uint256 indexed predictionId,
        uint256 actualMaturityDate
    );

    constructor() Ownable(msg.sender) {}

    function createPrediction(
        string memory cropType,
        uint256 plantingDate,
        uint256 predictedMaturityDate,
        uint256 confidenceLevel
    ) public returns (uint256) {
        uint256 predictionId = _predictionIdCounter++;
        predictions[predictionId] = MaturityPrediction({
            predictionId: predictionId,
            farmer: msg.sender,
            cropType: cropType,
            plantingDate: plantingDate,
            predictedMaturityDate: predictedMaturityDate,
            confidenceLevel: confidenceLevel,
            actualMaturityDate: 0
        });

        predictionsByFarmer[msg.sender].push(predictionId);
        emit PredictionCreated(predictionId, msg.sender, predictedMaturityDate);
        return predictionId;
    }

    function confirmMaturity(uint256 predictionId) public {
        require(predictions[predictionId].farmer == msg.sender, "Not authorized");
        require(predictions[predictionId].actualMaturityDate == 0, "Already confirmed");
        predictions[predictionId].actualMaturityDate = block.timestamp;
        emit MaturityConfirmed(predictionId, block.timestamp);
    }

    function getPrediction(uint256 predictionId) public view returns (MaturityPrediction memory) {
        return predictions[predictionId];
    }
}
