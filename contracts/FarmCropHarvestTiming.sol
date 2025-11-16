// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropHarvestTiming
 * @dev Onchain harvest timing optimization based on multiple factors
 */
contract FarmCropHarvestTiming is Ownable {
    struct HarvestTiming {
        uint256 timingId;
        address farmer;
        string fieldId;
        uint256 optimalHarvestDate;
        uint256 qualityScore;
        uint256 marketPrice;
        uint256 weatherFactor;
        uint256 calculationDate;
        string recommendation;
    }

    mapping(uint256 => HarvestTiming) public timings;
    mapping(address => uint256[]) public timingsByFarmer;
    uint256 private _timingIdCounter;

    event TimingCalculated(
        uint256 indexed timingId,
        address indexed farmer,
        string fieldId,
        uint256 optimalHarvestDate
    );

    constructor() Ownable(msg.sender) {}

    function calculateTiming(
        string memory fieldId,
        uint256 optimalHarvestDate,
        uint256 qualityScore,
        uint256 marketPrice,
        uint256 weatherFactor,
        string memory recommendation
    ) public returns (uint256) {
        uint256 timingId = _timingIdCounter++;
        timings[timingId] = HarvestTiming({
            timingId: timingId,
            farmer: msg.sender,
            fieldId: fieldId,
            optimalHarvestDate: optimalHarvestDate,
            qualityScore: qualityScore,
            marketPrice: marketPrice,
            weatherFactor: weatherFactor,
            calculationDate: block.timestamp,
            recommendation: recommendation
        });

        timingsByFarmer[msg.sender].push(timingId);
        emit TimingCalculated(timingId, msg.sender, fieldId, optimalHarvestDate);
        return timingId;
    }

    function getTiming(uint256 timingId) public view returns (HarvestTiming memory) {
        return timings[timingId];
    }
}
