// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSoilErosionControl
 * @dev Soil erosion control measures and effectiveness tracking
 */
contract FarmSoilErosionControl is Ownable {
    struct ControlMeasure {
        uint256 measureId;
        address farmer;
        string fieldId;
        string measureType;
        uint256 implementationDate;
        uint256 erosionReduction;
        bool effective;
    }

    mapping(uint256 => ControlMeasure) public measures;
    mapping(address => uint256[]) public measuresByFarmer;
    uint256 private _measureIdCounter;

    event MeasureImplemented(
        uint256 indexed measureId,
        address indexed farmer,
        string measureType
    );

    constructor() Ownable(msg.sender) {}

    function implementMeasure(
        string memory fieldId,
        string memory measureType,
        uint256 erosionReduction
    ) public returns (uint256) {
        uint256 measureId = _measureIdCounter++;
        measures[measureId] = ControlMeasure({
            measureId: measureId,
            farmer: msg.sender,
            fieldId: fieldId,
            measureType: measureType,
            implementationDate: block.timestamp,
            erosionReduction: erosionReduction,
            effective: false
        });

        measuresByFarmer[msg.sender].push(measureId);
        emit MeasureImplemented(measureId, msg.sender, measureType);
        return measureId;
    }

    function markEffective(uint256 measureId) public {
        require(measures[measureId].farmer == msg.sender, "Not authorized");
        measures[measureId].effective = true;
    }

    function getMeasure(uint256 measureId) public view returns (ControlMeasure memory) {
        return measures[measureId];
    }
}
