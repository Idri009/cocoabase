// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmInventoryValuation
 * @dev Real-time inventory valuation and asset management
 */
contract FarmInventoryValuation is Ownable {
    struct InventoryItem {
        uint256 itemId;
        address owner;
        string itemType;
        uint256 quantity;
        uint256 unitPrice;
        uint256 totalValue;
        uint256 lastUpdated;
    }

    mapping(uint256 => InventoryItem) public items;
    mapping(address => uint256[]) public itemsByOwner;
    uint256 private _itemIdCounter;

    event ItemValuated(
        uint256 indexed itemId,
        address indexed owner,
        uint256 totalValue
    );

    constructor() Ownable(msg.sender) {}

    function valueItem(
        string memory itemType,
        uint256 quantity,
        uint256 unitPrice
    ) public returns (uint256) {
        uint256 totalValue = quantity * unitPrice;
        uint256 itemId = _itemIdCounter++;
        items[itemId] = InventoryItem({
            itemId: itemId,
            owner: msg.sender,
            itemType: itemType,
            quantity: quantity,
            unitPrice: unitPrice,
            totalValue: totalValue,
            lastUpdated: block.timestamp
        });

        itemsByOwner[msg.sender].push(itemId);
        emit ItemValuated(itemId, msg.sender, totalValue);
        return itemId;
    }

    function updateValuation(uint256 itemId, uint256 unitPrice) public {
        require(items[itemId].owner == msg.sender, "Not authorized");
        items[itemId].unitPrice = unitPrice;
        items[itemId].totalValue = items[itemId].quantity * unitPrice;
        items[itemId].lastUpdated = block.timestamp;
        emit ItemValuated(itemId, msg.sender, items[itemId].totalValue);
    }

    function getItem(uint256 itemId) public view returns (InventoryItem memory) {
        return items[itemId];
    }
}
