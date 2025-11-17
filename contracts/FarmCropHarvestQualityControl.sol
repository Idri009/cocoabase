// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropHarvestQualityControl
 * @dev Onchain harvest quality control and certification
 */
contract FarmCropHarvestQualityControl is Ownable {
    struct QualityControl {
        uint256 controlId;
        address farmer;
        string harvestBatchId;
        string qualityGrade;
        uint256 score;
        uint256 inspectionDate;
        address inspector;
        bool isCertified;
    }

    mapping(uint256 => QualityControl) public controls;
    mapping(address => uint256[]) public controlsByFarmer;
    uint256 private _controlIdCounter;

    event QualityControlled(
        uint256 indexed controlId,
        address indexed farmer,
        string harvestBatchId,
        string qualityGrade
    );

    constructor() Ownable(msg.sender) {}

    function recordControl(
        address farmer,
        string memory harvestBatchId,
        string memory qualityGrade,
        uint256 score
    ) public onlyOwner returns (uint256) {
        uint256 controlId = _controlIdCounter++;
        controls[controlId] = QualityControl({
            controlId: controlId,
            farmer: farmer,
            harvestBatchId: harvestBatchId,
            qualityGrade: qualityGrade,
            score: score,
            inspectionDate: block.timestamp,
            inspector: msg.sender,
            isCertified: score >= 80
        });

        controlsByFarmer[farmer].push(controlId);
        emit QualityControlled(controlId, farmer, harvestBatchId, qualityGrade);
        return controlId;
    }

    function getControl(uint256 controlId) public view returns (QualityControl memory) {
        return controls[controlId];
    }
}

