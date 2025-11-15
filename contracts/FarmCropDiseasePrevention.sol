// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropDiseasePrevention
 * @dev Onchain disease prevention protocols and compliance tracking
 */
contract FarmCropDiseasePrevention is Ownable {
    struct PreventionProtocol {
        uint256 protocolId;
        address farmer;
        string cropType;
        string protocolType;
        uint256 implementationDate;
        string description;
        bool isCompliant;
    }

    mapping(uint256 => PreventionProtocol) public protocols;
    mapping(address => uint256[]) public protocolsByFarmer;
    uint256 private _protocolIdCounter;

    event ProtocolRecorded(
        uint256 indexed protocolId,
        address indexed farmer,
        string protocolType
    );

    constructor() Ownable(msg.sender) {}

    function recordProtocol(
        string memory cropType,
        string memory protocolType,
        string memory description
    ) public returns (uint256) {
        uint256 protocolId = _protocolIdCounter++;
        protocols[protocolId] = PreventionProtocol({
            protocolId: protocolId,
            farmer: msg.sender,
            cropType: cropType,
            protocolType: protocolType,
            implementationDate: block.timestamp,
            description: description,
            isCompliant: true
        });

        protocolsByFarmer[msg.sender].push(protocolId);
        emit ProtocolRecorded(protocolId, msg.sender, protocolType);
        return protocolId;
    }

    function verifyCompliance(uint256 protocolId, bool compliant) public onlyOwner {
        protocols[protocolId].isCompliant = compliant;
    }

    function getProtocol(uint256 protocolId) public view returns (PreventionProtocol memory) {
        return protocols[protocolId];
    }
}

