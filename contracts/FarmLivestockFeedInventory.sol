// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockFeedInventory
 * @dev Onchain livestock feed inventory management
 */
contract FarmLivestockFeedInventory is Ownable {
    struct FeedStock {
        uint256 stockId;
        address farmer;
        string feedType;
        uint256 quantity;
        uint256 unitPrice;
        uint256 purchaseDate;
        uint256 expiryDate;
    }

    mapping(uint256 => FeedStock) public stocks;
    mapping(address => uint256[]) public stocksByFarmer;
    uint256 private _stockIdCounter;

    event StockAdded(
        uint256 indexed stockId,
        address indexed farmer,
        string feedType,
        uint256 quantity
    );

    constructor() Ownable(msg.sender) {}

    function addStock(
        string memory feedType,
        uint256 quantity,
        uint256 unitPrice,
        uint256 expiryDate
    ) public returns (uint256) {
        uint256 stockId = _stockIdCounter++;
        stocks[stockId] = FeedStock({
            stockId: stockId,
            farmer: msg.sender,
            feedType: feedType,
            quantity: quantity,
            unitPrice: unitPrice,
            purchaseDate: block.timestamp,
            expiryDate: expiryDate
        });

        stocksByFarmer[msg.sender].push(stockId);
        emit StockAdded(stockId, msg.sender, feedType, quantity);
        return stockId;
    }

    function getStock(uint256 stockId) public view returns (FeedStock memory) {
        return stocks[stockId];
    }
}

