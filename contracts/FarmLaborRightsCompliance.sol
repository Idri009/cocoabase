// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLaborRightsCompliance
 * @dev Track labor rights audits, safety incidents, and fair wage verification
 */
contract FarmLaborRightsCompliance is Ownable {
    struct LaborAudit {
        uint256 auditId;
        address farm;
        string auditor;
        string scope;
        bool fairWageCompliant;
        uint256 safetyIncidents;
        uint256 auditDate;
        string findings;
    }

    mapping(uint256 => LaborAudit) public audits;
    mapping[address => uint256[]) public auditsByFarm;
    uint256 private _auditIdCounter;

    event LaborAuditRecorded(
        uint256 indexed auditId,
        address indexed farm,
        bool fairWageCompliant,
        uint256 safetyIncidents
    );

    constructor() Ownable(msg.sender) {}

    function recordLaborAudit(
        address farm,
        string memory auditor,
        string memory scope,
        bool fairWageCompliant,
        uint256 safetyIncidents,
        string memory findings
    ) public onlyOwner returns (uint256) {
        uint256 auditId = _auditIdCounter++;
        audits[auditId] = LaborAudit({
            auditId: auditId,
            farm: farm,
            auditor: auditor,
            scope: scope,
            fairWageCompliant: fairWageCompliant,
            safetyIncidents: safetyIncidents,
            auditDate: block.timestamp,
            findings: findings
        });

        auditsByFarm[farm].push(auditId);
        emit LaborAuditRecorded(auditId, farm, fairWageCompliant, safetyIncidents);
        return auditId;
    }

    function getAudit(uint256 auditId) public view returns (LaborAudit memory) {
        return audits[auditId];
    }
}


