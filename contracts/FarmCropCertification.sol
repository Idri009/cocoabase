// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropCertification
 * @dev Onchain crop quality certification
 */
contract FarmCropCertification is Ownable {
    struct Certification {
        uint256 certificationId;
        address farmer;
        uint256 cropId;
        string certificationType;
        string qualityGrade;
        uint256 issueDate;
        uint256 expiryDate;
        bool isActive;
        bool isRevoked;
        string inspector;
        string notes;
    }

    mapping(uint256 => Certification) public certifications;
    mapping(address => uint256[]) public certificationsByFarmer;
    mapping(uint256 => uint256[]) public certificationsByCrop;
    uint256 private _certificationIdCounter;

    event CertificationIssued(
        uint256 indexed certificationId,
        address indexed farmer,
        uint256 indexed cropId,
        string certificationType,
        string qualityGrade
    );

    event CertificationRevoked(
        uint256 indexed certificationId,
        address indexed farmer,
        string reason
    );

    constructor() Ownable(msg.sender) {}

    function issueCertification(
        address farmer,
        uint256 cropId,
        string memory certificationType,
        string memory qualityGrade,
        uint256 expiryDate,
        string memory inspector,
        string memory notes
    ) public onlyOwner returns (uint256) {
        require(expiryDate > block.timestamp, "Invalid expiry date");

        uint256 certificationId = _certificationIdCounter++;
        certifications[certificationId] = Certification({
            certificationId: certificationId,
            farmer: farmer,
            cropId: cropId,
            certificationType: certificationType,
            qualityGrade: qualityGrade,
            issueDate: block.timestamp,
            expiryDate: expiryDate,
            isActive: true,
            isRevoked: false,
            inspector: inspector,
            notes: notes
        });

        certificationsByFarmer[farmer].push(certificationId);
        certificationsByCrop[cropId].push(certificationId);

        emit CertificationIssued(certificationId, farmer, cropId, certificationType, qualityGrade);
        return certificationId;
    }

    function revokeCertification(uint256 certificationId, string memory reason) public onlyOwner {
        require(certifications[certificationId].isActive, "Certification not active");
        require(!certifications[certificationId].isRevoked, "Already revoked");

        certifications[certificationId].isActive = false;
        certifications[certificationId].isRevoked = true;

        emit CertificationRevoked(certificationId, certifications[certificationId].farmer, reason);
    }

    function verifyCertification(uint256 certificationId) public view returns (bool) {
        Certification memory cert = certifications[certificationId];
        return cert.isActive && !cert.isRevoked && block.timestamp <= cert.expiryDate;
    }

    function getCertification(uint256 certificationId) public view returns (Certification memory) {
        return certifications[certificationId];
    }

    function getCertificationsByFarmer(address farmer) public view returns (uint256[] memory) {
        return certificationsByFarmer[farmer];
    }

    function getCertificationsByCrop(uint256 cropId) public view returns (uint256[] memory) {
        return certificationsByCrop[cropId];
    }
}

