// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmAssetDepreciationTracking
 * @dev Asset depreciation tracking and accounting system
 */
contract FarmAssetDepreciationTracking is Ownable {
    struct AssetDepreciation {
        uint256 assetId;
        address owner;
        string assetType;
        uint256 originalValue;
        uint256 currentValue;
        uint256 depreciationRate;
        uint256 purchaseDate;
        uint256 lastCalculated;
    }

    mapping(uint256 => AssetDepreciation) public assets;
    mapping(address => uint256[]) public assetsByOwner;
    uint256 private _assetIdCounter;

    event AssetRegistered(
        uint256 indexed assetId,
        address indexed owner,
        uint256 originalValue
    );

    event DepreciationCalculated(
        uint256 indexed assetId,
        uint256 currentValue
    );

    constructor() Ownable(msg.sender) {}

    function registerAsset(
        string memory assetType,
        uint256 originalValue,
        uint256 depreciationRate
    ) public returns (uint256) {
        uint256 assetId = _assetIdCounter++;
        assets[assetId] = AssetDepreciation({
            assetId: assetId,
            owner: msg.sender,
            assetType: assetType,
            originalValue: originalValue,
            currentValue: originalValue,
            depreciationRate: depreciationRate,
            purchaseDate: block.timestamp,
            lastCalculated: block.timestamp
        });

        assetsByOwner[msg.sender].push(assetId);
        emit AssetRegistered(assetId, msg.sender, originalValue);
        return assetId;
    }

    function calculateDepreciation(uint256 assetId) public {
        require(assets[assetId].owner == msg.sender, "Not authorized");
        uint256 daysSincePurchase = (block.timestamp - assets[assetId].purchaseDate) / 1 days;
        uint256 totalDepreciation = (assets[assetId].originalValue * assets[assetId].depreciationRate * daysSincePurchase) / 10000 / 365;
        if (totalDepreciation > assets[assetId].originalValue) {
            assets[assetId].currentValue = 0;
        } else {
            assets[assetId].currentValue = assets[assetId].originalValue - totalDepreciation;
        }
        assets[assetId].lastCalculated = block.timestamp;
        emit DepreciationCalculated(assetId, assets[assetId].currentValue);
    }

    function getAsset(uint256 assetId) public view returns (AssetDepreciation memory) {
        return assets[assetId];
    }
}
