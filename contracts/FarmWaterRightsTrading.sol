// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWaterRightsTrading
 * @dev Onchain marketplace for trading water rights between farms
 */
contract FarmWaterRightsTrading is Ownable {
    struct WaterRight {
        uint256 rightId;
        uint256 waterAmount;
        uint256 price;
        address seller;
        address buyer;
        uint256 listingDate;
        bool sold;
    }

    mapping(uint256 => WaterRight) public waterRights;
    mapping(address => uint256[]) public rightsByOwner;
    uint256 private _rightIdCounter;

    event WaterRightListed(
        uint256 indexed rightId,
        address indexed seller,
        uint256 waterAmount,
        uint256 price
    );

    event WaterRightTraded(
        uint256 indexed rightId,
        address indexed buyer,
        uint256 price
    );

    constructor() Ownable(msg.sender) {}

    function listWaterRight(
        uint256 waterAmount,
        uint256 price
    ) public returns (uint256) {
        uint256 rightId = _rightIdCounter++;
        waterRights[rightId] = WaterRight({
            rightId: rightId,
            waterAmount: waterAmount,
            price: price,
            seller: msg.sender,
            buyer: address(0),
            listingDate: block.timestamp,
            sold: false
        });

        rightsByOwner[msg.sender].push(rightId);

        emit WaterRightListed(rightId, msg.sender, waterAmount, price);
        return rightId;
    }

    function purchaseWaterRight(uint256 rightId) public payable {
        require(!waterRights[rightId].sold, "Already sold");
        require(msg.value >= waterRights[rightId].price, "Insufficient payment");

        waterRights[rightId].sold = true;
        waterRights[rightId].buyer = msg.sender;

        payable(waterRights[rightId].seller).transfer(msg.value);

        emit WaterRightTraded(rightId, msg.sender, msg.value);
    }

    function getWaterRight(uint256 rightId) public view returns (WaterRight memory) {
        return waterRights[rightId];
    }
}

