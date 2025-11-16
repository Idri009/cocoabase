// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSeedCertification
 * @dev Seed certification system
 */
contract FarmSeedCertification is Ownable {
    struct SeedCert {
        uint256 certId;
        address producer;
        string seedVariety;
        bytes32 batchHash;
        uint256 issueDate;
        uint256 expiryDate;
        bool active;
        address certifier;
    }

    mapping(uint256 => SeedCert) public seedCerts;
    mapping(address => uint256[]) public certsByProducer;
    mapping(address => bool) public isCertifier;
    uint256 private _certIdCounter;

    event CertificationIssued(uint256 indexed certId, address indexed producer);
    event CertificationRevoked(uint256 indexed certId);
    event CertifierAdded(address indexed certifier);

    constructor() Ownable(msg.sender) {
        isCertifier[msg.sender] = true;
    }

    function addCertifier(address certifier) public onlyOwner {
        isCertifier[certifier] = true;
        emit CertifierAdded(certifier);
    }

    function issueCertification(
        address producer,
        string memory seedVariety,
        bytes32 batchHash,
        uint256 expiryDate
    ) public returns (uint256) {
        require(isCertifier[msg.sender], "Not a certifier");
        uint256 certId = _certIdCounter++;
        seedCerts[certId] = SeedCert({
            certId: certId,
            producer: producer,
            seedVariety: seedVariety,
            batchHash: batchHash,
            issueDate: block.timestamp,
            expiryDate: expiryDate,
            active: true,
            certifier: msg.sender
        });
        certsByProducer[producer].push(certId);
        emit CertificationIssued(certId, producer);
        return certId;
    }

    function revokeCertification(uint256 certId) public {
        require(
            seedCerts[certId].certifier == msg.sender || msg.sender == owner(),
            "Not authorized"
        );
        seedCerts[certId].active = false;
        emit CertificationRevoked(certId);
    }
}

