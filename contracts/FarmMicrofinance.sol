// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmMicrofinance
 * @dev Onchain microfinance loans for farmers
 */
contract FarmMicrofinance is Ownable {
    struct Loan {
        uint256 loanId;
        address borrower;
        uint256 principal;
        uint256 interestRate;
        uint256 termDays;
        uint256 startDate;
        uint256 dueDate;
        uint256 amountPaid;
        bool isRepaid;
        bool isDefaulted;
        string purpose;
    }

    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public loansByBorrower;
    uint256 private _loanIdCounter;
    uint256 public totalLoans;
    uint256 public totalFunds;
    uint256 public interestRateBase;

    event LoanCreated(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 principal,
        uint256 interestRate,
        uint256 termDays
    );

    event LoanRepayment(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 remainingBalance
    );

    event LoanRepaid(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 totalAmount
    );

    event LoanDefaulted(
        uint256 indexed loanId,
        address indexed borrower
    );

    constructor(uint256 _interestRateBase) Ownable(msg.sender) {
        interestRateBase = _interestRateBase;
    }

    function createLoan(
        address borrower,
        uint256 principal,
        uint256 termDays,
        string memory purpose
    ) public onlyOwner returns (uint256) {
        require(principal > 0, "Principal must be greater than 0");
        require(termDays > 0, "Term must be greater than 0");
        require(totalFunds >= principal, "Insufficient funds");

        uint256 loanId = _loanIdCounter++;
        uint256 interestRate = interestRateBase;
        uint256 startDate = block.timestamp;
        uint256 dueDate = startDate + (termDays * 1 days);

        loans[loanId] = Loan({
            loanId: loanId,
            borrower: borrower,
            principal: principal,
            interestRate: interestRate,
            termDays: termDays,
            startDate: startDate,
            dueDate: dueDate,
            amountPaid: 0,
            isRepaid: false,
            isDefaulted: false,
            purpose: purpose
        });

        loansByBorrower[borrower].push(loanId);
        totalLoans++;
        totalFunds -= principal;

        payable(borrower).transfer(principal);

        emit LoanCreated(loanId, borrower, principal, interestRate, termDays);
        return loanId;
    }

    function repayLoan(uint256 loanId) public payable {
        require(loans[loanId].borrower == msg.sender, "Not the borrower");
        require(!loans[loanId].isRepaid, "Loan already repaid");
        require(!loans[loanId].isDefaulted, "Loan is defaulted");

        uint256 totalAmount = calculateTotalAmount(loanId);
        uint256 remainingBalance = totalAmount - loans[loanId].amountPaid;

        require(msg.value >= remainingBalance, "Insufficient payment");

        loans[loanId].amountPaid = totalAmount;
        loans[loanId].isRepaid = true;
        totalFunds += totalAmount;

        emit LoanRepaid(loanId, msg.sender, totalAmount);
    }

    function makePayment(uint256 loanId) public payable {
        require(loans[loanId].borrower == msg.sender, "Not the borrower");
        require(!loans[loanId].isRepaid, "Loan already repaid");
        require(!loans[loanId].isDefaulted, "Loan is defaulted");

        loans[loanId].amountPaid += msg.value;
        totalFunds += msg.value;

        uint256 totalAmount = calculateTotalAmount(loanId);
        uint256 remainingBalance = totalAmount - loans[loanId].amountPaid;

        if (remainingBalance == 0) {
            loans[loanId].isRepaid = true;
            emit LoanRepaid(loanId, msg.sender, totalAmount);
        } else {
            emit LoanRepayment(loanId, msg.sender, msg.value, remainingBalance);
        }
    }

    function checkDefault(uint256 loanId) public {
        require(block.timestamp > loans[loanId].dueDate, "Loan not due yet");
        require(!loans[loanId].isRepaid, "Loan already repaid");
        require(!loans[loanId].isDefaulted, "Loan already defaulted");

        uint256 totalAmount = calculateTotalAmount(loanId);
        if (loans[loanId].amountPaid < totalAmount) {
            loans[loanId].isDefaulted = true;
            emit LoanDefaulted(loanId, loans[loanId].borrower);
        }
    }

    function calculateTotalAmount(uint256 loanId) public view returns (uint256) {
        Loan memory loan = loans[loanId];
        uint256 interest = (loan.principal * loan.interestRate * loan.termDays) / (100 * 365);
        return loan.principal + interest;
    }

    function depositFunds() public payable {
        totalFunds += msg.value;
    }

    function getLoan(uint256 loanId) public view returns (Loan memory) {
        return loans[loanId];
    }

    function getLoansByBorrower(address borrower) public view returns (uint256[] memory) {
        return loansByBorrower[borrower];
    }
}

