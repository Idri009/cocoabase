// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropDiseaseTreatment
 * @dev Disease treatment application and effectiveness tracking
 */
contract FarmCropDiseaseTreatment is Ownable {
    struct Treatment {
        uint256 treatmentId;
        address farmer;
        string fieldId;
        string diseaseType;
        string treatmentMethod;
        uint256 treatmentDate;
        bool effective;
    }

    mapping(uint256 => Treatment) public treatments;
    uint256 private _treatmentIdCounter;

    event TreatmentRecorded(
        uint256 indexed treatmentId,
        address indexed farmer,
        string diseaseType
    );

    constructor() Ownable(msg.sender) {}

    function recordTreatment(
        string memory fieldId,
        string memory diseaseType,
        string memory treatmentMethod
    ) public returns (uint256) {
        uint256 treatmentId = _treatmentIdCounter++;
        treatments[treatmentId] = Treatment({
            treatmentId: treatmentId,
            farmer: msg.sender,
            fieldId: fieldId,
            diseaseType: diseaseType,
            treatmentMethod: treatmentMethod,
            treatmentDate: block.timestamp,
            effective: false
        });

        emit TreatmentRecorded(treatmentId, msg.sender, diseaseType);
        return treatmentId;
    }

    function markEffective(uint256 treatmentId) public {
        require(treatments[treatmentId].farmer == msg.sender, "Not authorized");
        treatments[treatmentId].effective = true;
    }

    function getTreatment(uint256 treatmentId) public view returns (Treatment memory) {
        return treatments[treatmentId];
    }
}
