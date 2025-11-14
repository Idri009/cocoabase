// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropFinancing
 * @dev Onchain crop financing system
 */
contract FarmCropFinancing is Ownable {
    struct FinancingApplication {
        uint256 applicationId;
        address farmer;
        uint256 cropId;
        uint256 requestedAmount;
        uint256 interestRate;
        uint256 termDays;
        string purpose;
        uint256 applicationDate;
        bool isApproved;
        bool isFunded;
        bool isRepaid;
    }

    struct Repayment {
        uint256 repaymentId;
        uint256 applicationId;
        address farmer;
        uint256 amount;
        uint256 repaymentDate;
        bool isCompleted;
    }

    mapping(uint256 => FinancingApplication) public applications;
    mapping(uint256 => Repayment[]) public repayments;
    mapping(address => uint256[]) public applicationsByFarmer;
    uint256 private _applicationIdCounter;
    uint256 private _repaymentIdCounter;
    uint256 public totalFunds;
    uint256 public baseInterestRate;

    event ApplicationSubmitted(
        uint256 indexed applicationId,
        address indexed farmer,
        uint256 requestedAmount,
        string purpose
    );

    event ApplicationApproved(
        uint256 indexed applicationId,
        address indexed farmer,
        uint256 requestedAmount
    );

    event RepaymentMade(
        uint256 indexed repaymentId,
        uint256 indexed applicationId,
        address indexed farmer,
        uint256 amount
    );

    constructor(uint256 _baseInterestRate) Ownable(msg.sender) {
        baseInterestRate = _baseInterestRate;
    }

    function submitApplication(
        uint256 cropId,
        uint256 requestedAmount,
        uint256 termDays,
        string memory purpose
    ) public returns (uint256) {
        require(requestedAmount > 0, "Requested amount must be greater than 0");
        require(termDays > 0, "Term must be greater than 0");

        uint256 applicationId = _applicationIdCounter++;
        applications[applicationId] = FinancingApplication({
            applicationId: applicationId,
            farmer: msg.sender,
            cropId: cropId,
            requestedAmount: requestedAmount,
            interestRate: baseInterestRate,
            termDays: termDays,
            purpose: purpose,
            applicationDate: block.timestamp,
            isApproved: false,
            isFunded: false,
            isRepaid: false
        });

        applicationsByFarmer[msg.sender].push(applicationId);

        emit ApplicationSubmitted(applicationId, msg.sender, requestedAmount, purpose);
        return applicationId;
    }

    function approveApplication(uint256 applicationId) public onlyOwner {
        require(!applications[applicationId].isApproved, "Already approved");
        require(totalFunds >= applications[applicationId].requestedAmount, "Insufficient funds");

        applications[applicationId].isApproved = true;
        applications[applicationId].isFunded = true;
        totalFunds -= applications[applicationId].requestedAmount;

        payable(applications[applicationId].farmer).transfer(applications[applicationId].requestedAmount);

        emit ApplicationApproved(applicationId, applications[applicationId].farmer, applications[applicationId].requestedAmount);
    }

    function makeRepayment(uint256 applicationId) public payable {
        require(applications[applicationId].farmer == msg.sender, "Not the farmer");
        require(applications[applicationId].isFunded, "Application not funded");
        require(!applications[applicationId].isRepaid, "Already repaid");
        require(msg.value > 0, "Repayment amount must be greater than 0");

        uint256 repaymentId = _repaymentIdCounter++;
        repayments[applicationId].push(Repayment({
            repaymentId: repaymentId,
            applicationId: applicationId,
            farmer: msg.sender,
            amount: msg.value,
            repaymentDate: block.timestamp,
            isCompleted: true
        }));

        totalFunds += msg.value;

        uint256 totalRepaid = 0;
        for (uint256 i = 0; i < repayments[applicationId].length; i++) {
            totalRepaid += repayments[applicationId][i].amount;
        }

        uint256 totalAmount = calculateTotalAmount(applicationId);
        if (totalRepaid >= totalAmount) {
            applications[applicationId].isRepaid = true;
        }

        emit RepaymentMade(repaymentId, applicationId, msg.sender, msg.value);
    }

    function calculateTotalAmount(uint256 applicationId) public view returns (uint256) {
        FinancingApplication memory app = applications[applicationId];
        uint256 interest = (app.requestedAmount * app.interestRate * app.termDays) / (100 * 365);
        return app.requestedAmount + interest;
    }

    function depositFunds() public payable {
        totalFunds += msg.value;
    }

    function getApplication(uint256 applicationId) public view returns (FinancingApplication memory) {
        return applications[applicationId];
    }

    function getRepayments(uint256 applicationId) public view returns (Repayment[] memory) {
        return repayments[applicationId];
    }

    function getApplicationsByFarmer(address farmer) public view returns (uint256[] memory) {
        return applicationsByFarmer[farmer];
    }
}

