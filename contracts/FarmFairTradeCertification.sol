// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmFairTradeCertification
 * @dev Onchain fair trade certification and verification system
 */
contract FarmFairTradeCertification is Ownable {
    struct FairTradeCert {
        uint256 certId;
        address farmer;
        string certificationType;
        uint256 issueDate;
        uint256 expiryDate;
        bool active;
        string metadata;
    }

    mapping(uint256 => FairTradeCert) public certifications;
    mapping(address => uint256[]) public certsByFarmer;
    uint256 private _certIdCounter;

    event CertificationIssued(
        uint256 indexed certId,
        address indexed farmer,
        string certificationType
    );

    constructor() Ownable(msg.sender) {}

    function issueCertification(
        address farmer,
        string memory certificationType,
        uint256 validityDays,
        string memory metadata
    ) public onlyOwner returns (uint256) {
        uint256 certId = _certIdCounter++;
        certifications[certId] = FairTradeCert({
            certId: certId,
            farmer: farmer,
            certificationType: certificationType,
            issueDate: block.timestamp,
            expiryDate: block.timestamp + (validityDays * 1 days),
            active: true,
            metadata: metadata
        });

        certsByFarmer[farmer].push(certId);
        emit CertificationIssued(certId, farmer, certificationType);
        return certId;
    }

    function revokeCertification(uint256 certId) public onlyOwner {
        certifications[certId].active = false;
    }

    function verifyCertification(uint256 certId) public view returns (bool) {
        FairTradeCert memory cert = certifications[certId];
        return cert.active && block.timestamp <= cert.expiryDate;
    }

    function getCertification(uint256 certId) public view returns (FairTradeCert memory) {
        return certifications[certId];
    }
}
