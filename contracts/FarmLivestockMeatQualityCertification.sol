// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockMeatQualityCertification
 * @dev Onchain meat quality grading with certification
 */
contract FarmLivestockMeatQualityCertification is Ownable {
    struct QualityCertification {
        uint256 certId;
        address farmer;
        string livestockId;
        string grade;
        uint256 marblingScore;
        string color;
        string texture;
        uint256 certificationDate;
        address certifier;
        bool isCertified;
    }

    mapping(uint256 => QualityCertification) public certifications;
    mapping(address => uint256[]) public certificationsByFarmer;
    uint256 private _certIdCounter;

    event CertificationIssued(
        uint256 indexed certId,
        address indexed farmer,
        string livestockId,
        string grade
    );

    constructor() Ownable(msg.sender) {}

    function issueCertification(
        address farmer,
        string memory livestockId,
        string memory grade,
        uint256 marblingScore,
        string memory color,
        string memory texture
    ) public onlyOwner returns (uint256) {
        uint256 certId = _certIdCounter++;
        certifications[certId] = QualityCertification({
            certId: certId,
            farmer: farmer,
            livestockId: livestockId,
            grade: grade,
            marblingScore: marblingScore,
            color: color,
            texture: texture,
            certificationDate: block.timestamp,
            certifier: msg.sender,
            isCertified: true
        });

        certificationsByFarmer[farmer].push(certId);
        emit CertificationIssued(certId, farmer, livestockId, grade);
        return certId;
    }

    function getCertification(uint256 certId) public view returns (QualityCertification memory) {
        return certifications[certId];
    }
}

