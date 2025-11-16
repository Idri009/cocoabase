// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmMilestonePayments
 * @dev Milestone-based payment release system
 */
contract FarmMilestonePayments is Ownable {
    struct Milestone {
        uint256 milestoneId;
        string description;
        uint256 amount;
        bool completed;
    }

    struct PaymentPlan {
        uint256 planId;
        address payer;
        address payee;
        Milestone[] milestones;
        uint256 totalAmount;
        bool completed;
    }

    mapping(uint256 => PaymentPlan) public paymentPlans;
    mapping(address => uint256[]) public plansByPayer;
    uint256 private _planIdCounter;

    event PaymentPlanCreated(uint256 indexed planId, address indexed payer, address indexed payee);
    event MilestoneCompleted(uint256 indexed planId, uint256 indexed milestoneId);
    event PaymentReleased(uint256 indexed planId, uint256 indexed milestoneId, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function createPaymentPlan(
        address payee,
        string[] memory descriptions,
        uint256[] memory amounts
    ) public payable returns (uint256) {
        require(descriptions.length == amounts.length, "Arrays length mismatch");
        require(msg.value > 0, "No payment");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(msg.value >= totalAmount, "Insufficient payment");
        
        uint256 planId = _planIdCounter++;
        PaymentPlan storage plan = paymentPlans[planId];
        plan.planId = planId;
        plan.payer = msg.sender;
        plan.payee = payee;
        plan.totalAmount = totalAmount;
        
        for (uint256 i = 0; i < descriptions.length; i++) {
            plan.milestones.push(Milestone({
                milestoneId: i,
                description: descriptions[i],
                amount: amounts[i],
                completed: false
            }));
        }
        
        plansByPayer[msg.sender].push(planId);
        emit PaymentPlanCreated(planId, msg.sender, payee);
        return planId;
    }

    function completeMilestone(uint256 planId, uint256 milestoneId) public {
        PaymentPlan storage plan = paymentPlans[planId];
        require(plan.payee == msg.sender, "Not the payee");
        require(milestoneId < plan.milestones.length, "Invalid milestone");
        require(!plan.milestones[milestoneId].completed, "Already completed");
        
        plan.milestones[milestoneId].completed = true;
        payable(plan.payee).transfer(plan.milestones[milestoneId].amount);
        emit MilestoneCompleted(planId, milestoneId);
        emit PaymentReleased(planId, milestoneId, plan.milestones[milestoneId].amount);
    }
}


