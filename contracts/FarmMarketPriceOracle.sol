// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmMarketPriceOracle
 * @dev Real-time market price oracle feeds
 */
contract FarmMarketPriceOracle is Ownable {
    struct PriceData {
        uint256 price;
        uint256 timestamp;
        address source;
    }

    mapping(string => PriceData[]) public priceHistory;
    mapping(address => bool) public isPriceProvider;
    uint256 public priceStalenessThreshold = 1 hours;

    event PriceUpdated(string indexed commodity, uint256 price, address indexed source);
    event PriceProviderAdded(address indexed provider);
    event PriceProviderRemoved(address indexed provider);

    constructor() Ownable(msg.sender) {}

    function addPriceProvider(address provider) public onlyOwner {
        isPriceProvider[provider] = true;
        emit PriceProviderAdded(provider);
    }

    function updatePrice(string memory commodity, uint256 price) public {
        require(isPriceProvider[msg.sender], "Not a price provider");
        priceHistory[commodity].push(PriceData({
            price: price,
            timestamp: block.timestamp,
            source: msg.sender
        }));
        emit PriceUpdated(commodity, price, msg.sender);
    }

    function getLatestPrice(string memory commodity) public view returns (uint256) {
        PriceData[] memory prices = priceHistory[commodity];
        require(prices.length > 0, "No price data");
        uint256 latestIndex = prices.length - 1;
        require(
            block.timestamp - prices[latestIndex].timestamp <= priceStalenessThreshold,
            "Price too stale"
        );
        return prices[latestIndex].price;
    }

    function getPriceHistory(string memory commodity, uint256 count) 
        public 
        view 
        returns (PriceData[] memory) 
    {
        PriceData[] memory prices = priceHistory[commodity];
        uint256 length = prices.length < count ? prices.length : count;
        PriceData[] memory result = new PriceData[](length);
        for (uint256 i = 0; i < length; i++) {
            result[i] = prices[prices.length - 1 - i];
        }
        return result;
    }
}


