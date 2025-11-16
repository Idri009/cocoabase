// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmAgroforestryCertification
 * @dev Agroforestry certification and validation
 */
contract FarmAgroforestryCertification is Ownable {
    struct AgroforestryCert {
        uint256 certId;
        address farmer;
        uint256 treeCount;
        uint256 areaCovered;
        uint256 issueDate;
        uint256 expiryDate;
        bool active;
    }

    mapping(uint256 => AgroforestryCert) public certifications;
    mapping(address => uint256[]) public certsByFarmer;
    uint256 private _certIdCounter;

    event CertificationIssued(
        uint256 indexed certId,
        address indexed farmer,
        uint256 treeCount
    );

    constructor() Ownable(msg.sender) {}

    function issueCertification(
        address farmer,
        uint256 treeCount,
        uint256 areaCovered,
        uint256 validityDays
    ) public onlyOwner returns (uint256) {
        uint256 certId = _certIdCounter++;
        certifications[certId] = AgroforestryCert({
            certId: certId,
            farmer: farmer,
            treeCount: treeCount,
            areaCovered: areaCovered,
            issueDate: block.timestamp,
            expiryDate: block.timestamp + (validityDays * 1 days),
            active: true
        });

        certsByFarmer[farmer].push(certId);
        emit CertificationIssued(certId, farmer, treeCount);
        return certId;
    }

    function revokeCertification(uint256 certId) public onlyOwner {
        certifications[certId].active = false;
    }

    function verifyCertification(uint256 certId) public view returns (bool) {
        AgroforestryCert memory cert = certifications[certId];
        return cert.active && block.timestamp <= cert.expiryDate;
    }

    function getCertification(uint256 certId) public view returns (AgroforestryCert memory) {
        return certifications[certId];
    }
}
