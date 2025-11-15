// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmOrganicAudit
 * @dev Comprehensive organic certification audit system with compliance tracking
 */
contract FarmOrganicAudit is Ownable {
    struct AuditRecord {
        uint256 auditId;
        address farmAddress;
        address auditor;
        uint256 auditDate;
        bool passed;
        string[] complianceChecks;
        string findings;
        bool verified;
    }

    mapping(uint256 => AuditRecord) public audits;
    mapping(address => uint256[]) public auditsByFarm;
    uint256 private _auditIdCounter;

    event AuditConducted(
        uint256 indexed auditId,
        address indexed farmAddress,
        bool passed
    );

    constructor() Ownable(msg.sender) {}

    function conductAudit(
        address farmAddress,
        string[] memory complianceChecks,
        string memory findings,
        bool passed
    ) public returns (uint256) {
        uint256 auditId = _auditIdCounter++;
        audits[auditId] = AuditRecord({
            auditId: auditId,
            farmAddress: farmAddress,
            auditor: msg.sender,
            auditDate: block.timestamp,
            passed: passed,
            complianceChecks: complianceChecks,
            findings: findings,
            verified: false
        });

        auditsByFarm[farmAddress].push(auditId);
        emit AuditConducted(auditId, farmAddress, passed);
        return auditId;
    }

    function verifyAudit(uint256 auditId) public onlyOwner {
        audits[auditId].verified = true;
    }

    function getAudit(uint256 auditId) public view returns (AuditRecord memory) {
        return audits[auditId];
    }
}
