// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmBiodiversityIndex
 * @dev Biodiversity index calculation and tracking
 */
contract FarmBiodiversityIndex is Ownable {
    struct BiodiversityIndex {
        uint256 indexId;
        uint256 farmId;
        uint256 speciesCount;
        uint256 habitatScore;
        uint256 ecosystemScore;
        uint256 overallIndex;
        uint256 timestamp;
    }

    mapping(uint256 => BiodiversityIndex) public biodiversityIndices;
    mapping(uint256 => uint256[]) public indicesByFarm;
    uint256 private _indexIdCounter;

    event IndexCalculated(
        uint256 indexed indexId,
        uint256 farmId,
        uint256 overallIndex
    );

    constructor() Ownable(msg.sender) {}

    function calculateIndex(
        uint256 farmId,
        uint256 speciesCount,
        uint256 habitatScore,
        uint256 ecosystemScore
    ) public returns (uint256) {
        uint256 overallIndex = (speciesCount * 10 + habitatScore + ecosystemScore) / 3;
        uint256 indexId = _indexIdCounter++;
        biodiversityIndices[indexId] = BiodiversityIndex({
            indexId: indexId,
            farmId: farmId,
            speciesCount: speciesCount,
            habitatScore: habitatScore,
            ecosystemScore: ecosystemScore,
            overallIndex: overallIndex,
            timestamp: block.timestamp
        });
        indicesByFarm[farmId].push(indexId);
        emit IndexCalculated(indexId, farmId, overallIndex);
        return indexId;
    }

    function getLatestIndex(uint256 farmId) public view returns (BiodiversityIndex memory) {
        require(indicesByFarm[farmId].length > 0, "No indices found");
        uint256 latestId = indicesByFarm[farmId][indicesByFarm[farmId].length - 1];
        return biodiversityIndices[latestId];
    }
}
