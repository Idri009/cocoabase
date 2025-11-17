// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockMortalityPrevention
 * @dev Livestock mortality prevention tracking and measures
 */
contract FarmLivestockMortalityPrevention is Ownable {
    struct PreventionMeasure {
        uint256 measureId;
        address farmer;
        string livestockId;
        string measureType;
        uint256 implementationDate;
        bool effective;
    }

    mapping(uint256 => PreventionMeasure) public measures;
    uint256 private _measureIdCounter;

    event MeasureImplemented(
        uint256 indexed measureId,
        address indexed farmer,
        string measureType
    );

    constructor() Ownable(msg.sender) {}

    function implementMeasure(
        string memory livestockId,
        string memory measureType
    ) public returns (uint256) {
        uint256 measureId = _measureIdCounter++;
        measures[measureId] = PreventionMeasure({
            measureId: measureId,
            farmer: msg.sender,
            livestockId: livestockId,
            measureType: measureType,
            implementationDate: block.timestamp,
            effective: false
        });

        emit MeasureImplemented(measureId, msg.sender, measureType);
        return measureId;
    }

    function markEffective(uint256 measureId) public {
        require(measures[measureId].farmer == msg.sender, "Not authorized");
        measures[measureId].effective = true;
    }

    function getMeasure(uint256 measureId) public view returns (PreventionMeasure memory) {
        return measures[measureId];
    }
}
