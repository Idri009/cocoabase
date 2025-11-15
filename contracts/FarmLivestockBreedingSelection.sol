// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockBreedingSelection
 * @dev Track breeding selection decisions
 */
contract FarmLivestockBreedingSelection is Ownable {
    struct SelectionDecision {
        uint256 decisionId;
        uint256 parent1Id;
        uint256 parent2Id;
        string selectionCriteria;
        uint256 expectedOutcome;
        uint256 decisionDate;
        address selector;
    }

    mapping(uint256 => SelectionDecision) public decisions;
    mapping(address => uint256[]) public decisionsByOwner;
    uint256 private _decisionIdCounter;

    event DecisionMade(
        uint256 indexed decisionId,
        address indexed owner,
        uint256 parent1Id,
        uint256 parent2Id
    );

    constructor() Ownable(msg.sender) {}

    function makeDecision(
        uint256 parent1Id,
        uint256 parent2Id,
        string memory selectionCriteria,
        uint256 expectedOutcome
    ) public returns (uint256) {
        uint256 decisionId = _decisionIdCounter++;
        decisions[decisionId] = SelectionDecision({
            decisionId: decisionId,
            parent1Id: parent1Id,
            parent2Id: parent2Id,
            selectionCriteria: selectionCriteria,
            expectedOutcome: expectedOutcome,
            decisionDate: block.timestamp,
            selector: msg.sender
        });

        decisionsByOwner[msg.sender].push(decisionId);

        emit DecisionMade(decisionId, msg.sender, parent1Id, parent2Id);
        return decisionId;
    }

    function getDecision(uint256 decisionId) public view returns (SelectionDecision memory) {
        return decisions[decisionId];
    }

    function getDecisionsByOwner(address owner) public view returns (uint256[] memory) {
        return decisionsByOwner[owner];
    }
}


