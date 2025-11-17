// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropYieldComparison
 * @dev Yield comparison analysis across seasons and fields
 */
contract FarmCropYieldComparison is Ownable {
    struct Comparison {
        uint256 comparisonId;
        address farmer;
        string fieldId1;
        string fieldId2;
        uint256 yield1;
        uint256 yield2;
        uint256 difference;
        uint256 comparisonDate;
    }

    mapping(uint256 => Comparison) public comparisons;
    uint256 private _comparisonIdCounter;

    event ComparisonCreated(
        uint256 indexed comparisonId,
        address indexed farmer,
        uint256 difference
    );

    constructor() Ownable(msg.sender) {}

    function createComparison(
        string memory fieldId1,
        string memory fieldId2,
        uint256 yield1,
        uint256 yield2
    ) public returns (uint256) {
        uint256 difference = yield1 > yield2 ? yield1 - yield2 : yield2 - yield1;
        uint256 comparisonId = _comparisonIdCounter++;
        comparisons[comparisonId] = Comparison({
            comparisonId: comparisonId,
            farmer: msg.sender,
            fieldId1: fieldId1,
            fieldId2: fieldId2,
            yield1: yield1,
            yield2: yield2,
            difference: difference,
            comparisonDate: block.timestamp
        });

        emit ComparisonCreated(comparisonId, msg.sender, difference);
        return comparisonId;
    }

    function getComparison(uint256 comparisonId) public view returns (Comparison memory) {
        return comparisons[comparisonId];
    }
}
