// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCrossChainBridge
 * @dev Cross-chain asset bridging for multi-chain operations
 */
contract FarmCrossChainBridge is Ownable {
    struct BridgeRequest {
        uint256 requestId;
        address user;
        uint256 amount;
        uint256 targetChainId;
        address targetAddress;
        bool completed;
    }

    mapping(uint256 => BridgeRequest) public bridgeRequests;
    mapping(uint256 => bool) public supportedChains;
    mapping(address => uint256[]) public requestsByUser;
    uint256 private _requestIdCounter;

    event BridgeRequestCreated(
        uint256 indexed requestId,
        address indexed user,
        uint256 targetChainId
    );
    event BridgeCompleted(uint256 indexed requestId);
    event ChainSupported(uint256 indexed chainId, bool supported);

    constructor() Ownable(msg.sender) {}

    function addSupportedChain(uint256 chainId) public onlyOwner {
        supportedChains[chainId] = true;
        emit ChainSupported(chainId, true);
    }

    function createBridgeRequest(
        uint256 targetChainId,
        address targetAddress
    ) public payable returns (uint256) {
        require(supportedChains[targetChainId], "Chain not supported");
        require(msg.value > 0, "Amount must be greater than 0");
        
        uint256 requestId = _requestIdCounter++;
        bridgeRequests[requestId] = BridgeRequest({
            requestId: requestId,
            user: msg.sender,
            amount: msg.value,
            targetChainId: targetChainId,
            targetAddress: targetAddress,
            completed: false
        });
        requestsByUser[msg.sender].push(requestId);
        emit BridgeRequestCreated(requestId, msg.sender, targetChainId);
        return requestId;
    }

    function completeBridge(uint256 requestId) public onlyOwner {
        BridgeRequest storage request = bridgeRequests[requestId];
        require(!request.completed, "Already completed");
        request.completed = true;
        emit BridgeCompleted(requestId);
    }

    receive() external payable {}
}


