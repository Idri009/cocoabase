// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockFeedRationCalculation
 * @dev Onchain feed ration calculation and optimization
 */
contract FarmLivestockFeedRationCalculation is Ownable {
    struct FeedRation {
        uint256 rationId;
        address farmer;
        string livestockId;
        string feedType;
        uint256 quantity;
        uint256 proteinContent;
        uint256 energyContent;
        uint256 calculationDate;
    }

    mapping(uint256 => FeedRation) public rations;
    mapping(address => uint256[]) public rationsByFarmer;
    uint256 private _rationIdCounter;

    event RationCalculated(
        uint256 indexed rationId,
        address indexed farmer,
        string livestockId
    );

    constructor() Ownable(msg.sender) {}

    function calculateRation(
        string memory livestockId,
        string memory feedType,
        uint256 quantity,
        uint256 proteinContent,
        uint256 energyContent
    ) public returns (uint256) {
        uint256 rationId = _rationIdCounter++;
        rations[rationId] = FeedRation({
            rationId: rationId,
            farmer: msg.sender,
            livestockId: livestockId,
            feedType: feedType,
            quantity: quantity,
            proteinContent: proteinContent,
            energyContent: energyContent,
            calculationDate: block.timestamp
        });

        rationsByFarmer[msg.sender].push(rationId);
        emit RationCalculated(rationId, msg.sender, livestockId);
        return rationId;
    }

    function getRation(uint256 rationId) public view returns (FeedRation memory) {
        return rations[rationId];
    }
}

