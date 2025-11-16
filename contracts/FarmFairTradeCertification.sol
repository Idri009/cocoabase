// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmFairTradeCertification
 * @dev Fair trade certification and compliance tracking
 */
contract FarmFairTradeCertification is Ownable {
    struct Certification {
        uint256 certId;
        address farmer;
        string productType;
        uint256 issueDate;
        uint256 expiryDate;
        bool active;
        address issuer;
    }

    mapping(uint256 => Certification) public certifications;
    mapping(address => uint256[]) public certsByFarmer;
    mapping(address => bool) public isIssuer;
    uint256 private _certIdCounter;

    event CertificationIssued(uint256 indexed certId, address indexed farmer);
    event CertificationRevoked(uint256 indexed certId);
    event IssuerAdded(address indexed issuer);

    constructor() Ownable(msg.sender) {
        isIssuer[msg.sender] = true;
    }

    function addIssuer(address issuer) public onlyOwner {
        isIssuer[issuer] = true;
        emit IssuerAdded(issuer);
    }

    function issueCertification(
        address farmer,
        string memory productType,
        uint256 expiryDate
    ) public returns (uint256) {
        require(isIssuer[msg.sender], "Not an issuer");
        uint256 certId = _certIdCounter++;
        certifications[certId] = Certification({
            certId: certId,
            farmer: farmer,
            productType: productType,
            issueDate: block.timestamp,
            expiryDate: expiryDate,
            active: true,
            issuer: msg.sender
        });
        certsByFarmer[farmer].push(certId);
        emit CertificationIssued(certId, farmer);
        return certId;
    }

    function revokeCertification(uint256 certId) public {
        require(
            certifications[certId].issuer == msg.sender || msg.sender == owner(),
            "Not authorized"
        );
        certifications[certId].active = false;
        emit CertificationRevoked(certId);
    }
}
