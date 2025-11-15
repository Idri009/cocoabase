// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmOrganicCertification
 * @dev Onchain system for managing organic certifications
 */
contract FarmOrganicCertification is Ownable {
    struct Certification {
        uint256 certId;
        uint256 plantationId;
        string certType;
        uint256 issueDate;
        uint256 expiryDate;
        address certifier;
        bool valid;
    }

    mapping(uint256 => Certification) public certifications;
    mapping(address => uint256[]) public certsByCertifier;
    uint256 private _certIdCounter;

    event CertificationIssued(
        uint256 indexed certId,
        address indexed certifier,
        string certType
    );

    event CertificationRevoked(uint256 indexed certId);

    constructor() Ownable(msg.sender) {}

    function issueCertification(
        uint256 plantationId,
        string memory certType,
        uint256 validityPeriod
    ) public returns (uint256) {
        uint256 certId = _certIdCounter++;
        certifications[certId] = Certification({
            certId: certId,
            plantationId: plantationId,
            certType: certType,
            issueDate: block.timestamp,
            expiryDate: block.timestamp + validityPeriod,
            certifier: msg.sender,
            valid: true
        });

        certsByCertifier[msg.sender].push(certId);

        emit CertificationIssued(certId, msg.sender, certType);
        return certId;
    }

    function revokeCertification(uint256 certId) public onlyOwner {
        certifications[certId].valid = false;
        emit CertificationRevoked(certId);
    }

    function getCertification(uint256 certId) public view returns (Certification memory) {
        return certifications[certId];
    }
}



