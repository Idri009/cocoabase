// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropTraceabilitySystem
 * @dev Enhanced traceability system
 */
contract FarmCropTraceabilitySystem is Ownable {
    struct Trace {
        uint256 traceId;
        address farmer;
        uint256 productId;
        bytes32 originHash;
        bytes32[] chainHashes;
        uint256 timestamp;
    }

    mapping(uint256 => Trace) public traces;
    mapping(uint256 => uint256) public tracesByProduct;
    uint256 private _traceIdCounter;

    event TraceCreated(uint256 indexed traceId, uint256 productId);
    event ChainLinkAdded(uint256 indexed traceId, bytes32 chainHash);

    constructor() Ownable(msg.sender) {}

    function createTrace(
        uint256 productId,
        bytes32 originHash
    ) public returns (uint256) {
        uint256 traceId = _traceIdCounter++;
        traces[traceId] = Trace({
            traceId: traceId,
            farmer: msg.sender,
            productId: productId,
            originHash: originHash,
            chainHashes: new bytes32[](0),
            timestamp: block.timestamp
        });
        tracesByProduct[productId] = traceId;
        emit TraceCreated(traceId, productId);
        return traceId;
    }

    function addChainLink(uint256 traceId, bytes32 chainHash) public {
        require(traces[traceId].farmer == msg.sender, "Not the owner");
        traces[traceId].chainHashes.push(chainHash);
        emit ChainLinkAdded(traceId, chainHash);
    }
}
