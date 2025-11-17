// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockFeedFormulation
 * @dev Feed formulation optimization system
 */
contract FarmLivestockFeedFormulation is Ownable {
    struct FeedFormula {
        uint256 formulaId;
        address farmer;
        string livestockType;
        uint256 protein;
        uint256 carbohydrates;
        uint256 fats;
        uint256 cost;
    }

    mapping(uint256 => FeedFormula) public formulas;
    mapping(address => uint256[]) public formulasByFarmer;
    uint256 private _formulaIdCounter;

    event FormulaCreated(uint256 indexed formulaId, string livestockType);

    constructor() Ownable(msg.sender) {}

    function createFormula(
        string memory livestockType,
        uint256 protein,
        uint256 carbohydrates,
        uint256 fats,
        uint256 cost
    ) public returns (uint256) {
        uint256 formulaId = _formulaIdCounter++;
        formulas[formulaId] = FeedFormula({
            formulaId: formulaId,
            farmer: msg.sender,
            livestockType: livestockType,
            protein: protein,
            carbohydrates: carbohydrates,
            fats: fats,
            cost: cost
        });
        formulasByFarmer[msg.sender].push(formulaId);
        emit FormulaCreated(formulaId, livestockType);
        return formulaId;
    }
}

