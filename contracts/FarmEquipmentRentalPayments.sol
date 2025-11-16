// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmEquipmentRentalPayments
 * @dev Equipment rental payment automation and tracking
 */
contract FarmEquipmentRentalPayments is Ownable {
    struct RentalAgreement {
        uint256 rentalId;
        address owner;
        address renter;
        uint256 dailyRate;
        uint256 startDate;
        uint256 endDate;
        bool active;
    }

    struct RentalPayment {
        uint256 paymentId;
        uint256 rentalId;
        uint256 amount;
        uint256 paymentDate;
    }

    mapping(uint256 => RentalAgreement) public rentals;
    mapping(uint256 => RentalPayment[]) public paymentsByRental;
    uint256 private _rentalIdCounter;
    uint256 private _paymentIdCounter;

    event RentalCreated(
        uint256 indexed rentalId,
        address indexed owner,
        address indexed renter
    );

    event PaymentReceived(
        uint256 indexed paymentId,
        uint256 indexed rentalId,
        uint256 amount
    );

    constructor() Ownable(msg.sender) {}

    function createRental(
        address renter,
        uint256 dailyRate,
        uint256 startDate,
        uint256 endDate
    ) public returns (uint256) {
        uint256 rentalId = _rentalIdCounter++;
        rentals[rentalId] = RentalAgreement({
            rentalId: rentalId,
            owner: msg.sender,
            renter: renter,
            dailyRate: dailyRate,
            startDate: startDate,
            endDate: endDate,
            active: true
        });

        emit RentalCreated(rentalId, msg.sender, renter);
        return rentalId;
    }

    function makePayment(uint256 rentalId, uint256 daysRented) public payable {
        require(rentals[rentalId].renter == msg.sender, "Not authorized");
        uint256 expectedAmount = daysRented * rentals[rentalId].dailyRate;
        require(msg.value == expectedAmount, "Incorrect amount");
        uint256 paymentId = _paymentIdCounter++;
        paymentsByRental[rentalId].push(RentalPayment({
            paymentId: paymentId,
            rentalId: rentalId,
            amount: msg.value,
            paymentDate: block.timestamp
        }));
        payable(rentals[rentalId].owner).transfer(msg.value);
        emit PaymentReceived(paymentId, rentalId, msg.value);
    }

    function getRental(uint256 rentalId) public view returns (RentalAgreement memory) {
        return rentals[rentalId];
    }
}
