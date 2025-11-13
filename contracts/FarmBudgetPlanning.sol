// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmBudgetPlanning
 * @dev Onchain budget planning and tracking
 */
contract FarmBudgetPlanning is Ownable {
    struct Budget {
        uint256 budgetId;
        address owner;
        uint256 totalAmount;
        uint256 spentAmount;
        uint256 periodStart;
        uint256 periodEnd;
        string budgetName;
        bool active;
    }

    mapping(uint256 => Budget) public budgets;
    mapping(address => uint256[]) public budgetsByOwner;
    uint256 private _budgetIdCounter;

    event BudgetCreated(
        uint256 indexed budgetId,
        address indexed owner,
        uint256 totalAmount
    );

    event ExpenseRecorded(
        uint256 indexed budgetId,
        uint256 amount,
        uint256 remaining
    );

    constructor() Ownable(msg.sender) {}

    function createBudget(
        uint256 totalAmount,
        uint256 periodStart,
        uint256 periodEnd,
        string memory budgetName
    ) public returns (uint256) {
        uint256 budgetId = _budgetIdCounter++;
        budgets[budgetId] = Budget({
            budgetId: budgetId,
            owner: msg.sender,
            totalAmount: totalAmount,
            spentAmount: 0,
            periodStart: periodStart,
            periodEnd: periodEnd,
            budgetName: budgetName,
            active: true
        });

        budgetsByOwner[msg.sender].push(budgetId);

        emit BudgetCreated(budgetId, msg.sender, totalAmount);
        return budgetId;
    }

    function recordExpense(uint256 budgetId, uint256 amount) public {
        Budget storage budget = budgets[budgetId];
        require(budget.owner == msg.sender, "Not the owner");
        require(budget.active, "Budget not active");
        require(budget.spentAmount + amount <= budget.totalAmount, "Exceeds budget");

        budget.spentAmount += amount;

        emit ExpenseRecorded(budgetId, amount, budget.totalAmount - budget.spentAmount);
    }

    function getBudget(uint256 budgetId) public view returns (Budget memory) {
        return budgets[budgetId];
    }

    function getBudgetsByOwner(address owner) public view returns (uint256[] memory) {
        return budgetsByOwner[owner];
    }
}

