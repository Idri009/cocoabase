// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLaborContracts
 * @dev Onchain labor contract management
 */
contract FarmLaborContracts is Ownable {
    struct LaborContract {
        uint256 contractId;
        address employer;
        address worker;
        uint256 startDate;
        uint256 endDate;
        uint256 wagePerDay;
        string role;
        string terms;
        bool active;
        uint256 totalPaid;
    }

    mapping(uint256 => LaborContract) public contracts;
    mapping(address => uint256[]) public contractsByEmployer;
    mapping(address => uint256[]) public contractsByWorker;
    uint256 private _contractIdCounter;

    event ContractCreated(
        uint256 indexed contractId,
        address indexed employer,
        address indexed worker,
        uint256 wagePerDay
    );

    event PaymentMade(
        uint256 indexed contractId,
        uint256 amount,
        uint256 totalPaid
    );

    constructor() Ownable(msg.sender) {}

    function createContract(
        address worker,
        uint256 startDate,
        uint256 endDate,
        uint256 wagePerDay,
        string memory role,
        string memory terms
    ) public returns (uint256) {
        uint256 contractId = _contractIdCounter++;
        contracts[contractId] = LaborContract({
            contractId: contractId,
            employer: msg.sender,
            worker: worker,
            startDate: startDate,
            endDate: endDate,
            wagePerDay: wagePerDay,
            role: role,
            terms: terms,
            active: true,
            totalPaid: 0
        });

        contractsByEmployer[msg.sender].push(contractId);
        contractsByWorker[worker].push(contractId);

        emit ContractCreated(contractId, msg.sender, worker, wagePerDay);
        return contractId;
    }

    function recordPayment(uint256 contractId, uint256 amount) public {
        LaborContract storage contract_ = contracts[contractId];
        require(contract_.employer == msg.sender, "Not the employer");
        require(contract_.active, "Contract not active");

        contract_.totalPaid += amount;

        emit PaymentMade(contractId, amount, contract_.totalPaid);
    }

    function getContract(uint256 contractId) public view returns (LaborContract memory) {
        return contracts[contractId];
    }

    function getContractsByEmployer(address employer) public view returns (uint256[] memory) {
        return contractsByEmployer[employer];
    }

    function getContractsByWorker(address worker) public view returns (uint256[] memory) {
        return contractsByWorker[worker];
    }
}

