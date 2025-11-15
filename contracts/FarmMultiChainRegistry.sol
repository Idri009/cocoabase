// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmMultiChainRegistry
 * @dev Multi-chain asset registry synchronization
 */
contract FarmMultiChainRegistry is Ownable {
    struct Asset {
        uint256 assetId;
        address owner;
        uint256 chainId;
        bytes32 assetHash;
        bool synced;
    }

    mapping(uint256 => Asset) public assets;
    mapping(bytes32 => uint256[]) public assetsByHash;
    mapping(uint256 => bool) public supportedChains;
    uint256 private _assetIdCounter;

    event AssetRegistered(
        uint256 indexed assetId,
        address indexed owner,
        uint256 chainId
    );
    event AssetSynced(uint256 indexed assetId, uint256 targetChainId);
    event ChainSupported(uint256 indexed chainId, bool supported);

    constructor() Ownable(msg.sender) {}

    function addSupportedChain(uint256 chainId) public onlyOwner {
        supportedChains[chainId] = true;
        emit ChainSupported(chainId, true);
    }

    function registerAsset(
        uint256 chainId,
        bytes32 assetHash
    ) public returns (uint256) {
        require(supportedChains[chainId], "Chain not supported");
        uint256 assetId = _assetIdCounter++;
        assets[assetId] = Asset({
            assetId: assetId,
            owner: msg.sender,
            chainId: chainId,
            assetHash: assetHash,
            synced: false
        });
        assetsByHash[assetHash].push(assetId);
        emit AssetRegistered(assetId, msg.sender, chainId);
        return assetId;
    }

    function syncAsset(uint256 assetId, uint256 targetChainId) public {
        Asset storage asset = assets[assetId];
        require(asset.owner == msg.sender, "Not the owner");
        require(supportedChains[targetChainId], "Target chain not supported");
        asset.synced = true;
        emit AssetSynced(assetId, targetChainId);
    }
}

