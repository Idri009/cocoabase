// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmDisasterRelief
 * @dev Disaster relief fund management
 */
contract FarmDisasterRelief is Ownable {
    struct ReliefFund {
        uint256 fundId;
        address beneficiary;
        uint256 requestedAmount;
        uint256 approvedAmount;
        string disasterType;
        bool approved;
        bool disbursed;
        uint256 requestDate;
    }

    mapping(uint256 => ReliefFund) public reliefFunds;
    mapping(address => uint256[]) public fundsByBeneficiary;
    mapping(address => bool) public isApprover;
    uint256 private _fundIdCounter;

    event FundRequested(uint256 indexed fundId, address indexed beneficiary, uint256 amount);
    event FundApproved(uint256 indexed fundId, uint256 amount);
    event FundDisbursed(uint256 indexed fundId, uint256 amount);

    constructor() Ownable(msg.sender) {
        isApprover[msg.sender] = true;
    }

    function addApprover(address approver) public onlyOwner {
        isApprover[approver] = true;
    }

    function requestRelief(
        uint256 requestedAmount,
        string memory disasterType
    ) public returns (uint256) {
        require(requestedAmount > 0, "Invalid amount");
        uint256 fundId = _fundIdCounter++;
        reliefFunds[fundId] = ReliefFund({
            fundId: fundId,
            beneficiary: msg.sender,
            requestedAmount: requestedAmount,
            approvedAmount: 0,
            disasterType: disasterType,
            approved: false,
            disbursed: false,
            requestDate: block.timestamp
        });
        fundsByBeneficiary[msg.sender].push(fundId);
        emit FundRequested(fundId, msg.sender, requestedAmount);
        return fundId;
    }

    function approveRelief(uint256 fundId, uint256 approvedAmount) public {
        require(isApprover[msg.sender], "Not an approver");
        require(!reliefFunds[fundId].approved, "Already approved");
        reliefFunds[fundId].approved = true;
        reliefFunds[fundId].approvedAmount = approvedAmount;
        emit FundApproved(fundId, approvedAmount);
    }

    function disburseRelief(uint256 fundId) public payable {
        ReliefFund storage fund = reliefFunds[fundId];
        require(fund.approved, "Not approved");
        require(!fund.disbursed, "Already disbursed");
        require(msg.value >= fund.approvedAmount, "Insufficient payment");
        fund.disbursed = true;
        payable(fund.beneficiary).transfer(fund.approvedAmount);
        emit FundDisbursed(fundId, fund.approvedAmount);
    }

    receive() external payable {}
}

