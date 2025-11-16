// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmSeasonalPriceContracts
 * @dev Seasonal pricing contracts with price adjustment mechanisms
 */
contract FarmSeasonalPriceContracts is Ownable {
    struct PriceContract {
        uint256 contractId;
        address buyer;
        address seller;
        string productType;
        uint256 basePrice;
        uint256 quantity;
        uint256 startDate;
        uint256 endDate;
        bool active;
    }

    mapping(uint256 => PriceContract) public contracts;
    mapping(address => uint256[]) public contractsBySeller;
    uint256 private _contractIdCounter;

    event ContractCreated(
        uint256 indexed contractId,
        address indexed buyer,
        address indexed seller,
        uint256 basePrice
    );

    constructor() Ownable(msg.sender) {}

    function createContract(
        address seller,
        string memory productType,
        uint256 basePrice,
        uint256 quantity,
        uint256 startDate,
        uint256 endDate
    ) public returns (uint256) {
        uint256 contractId = _contractIdCounter++;
        contracts[contractId] = PriceContract({
            contractId: contractId,
            buyer: msg.sender,
            seller: seller,
            productType: productType,
            basePrice: basePrice,
            quantity: quantity,
            startDate: startDate,
            endDate: endDate,
            active: true
        });

        contractsBySeller[seller].push(contractId);
        emit ContractCreated(contractId, msg.sender, seller, basePrice);
        return contractId;
    }

    function deactivateContract(uint256 contractId) public {
        require(contracts[contractId].buyer == msg.sender || contracts[contractId].seller == msg.sender, "Not authorized");
        contracts[contractId].active = false;
    }

    function getContract(uint256 contractId) public view returns (PriceContract memory) {
        return contracts[contractId];
    }
}
