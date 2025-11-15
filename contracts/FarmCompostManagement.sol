// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCompostManagement
 * @dev Onchain system for managing compost production and usage
 */
contract FarmCompostManagement is Ownable {
    struct CompostBatch {
        uint256 batchId;
        uint256 plantationId;
        uint256 quantity;
        uint256 productionDate;
        uint256 maturityDate;
        address producer;
        bool ready;
    }

    mapping(uint256 => CompostBatch) public compostBatches;
    mapping(address => uint256[]) public batchesByProducer;
    uint256 private _batchIdCounter;

    event CompostBatchCreated(
        uint256 indexed batchId,
        address indexed producer,
        uint256 quantity
    );

    event CompostReady(uint256 indexed batchId);

    constructor() Ownable(msg.sender) {}

    function createBatch(
        uint256 plantationId,
        uint256 quantity,
        uint256 maturityPeriod
    ) public returns (uint256) {
        uint256 batchId = _batchIdCounter++;
        compostBatches[batchId] = CompostBatch({
            batchId: batchId,
            plantationId: plantationId,
            quantity: quantity,
            productionDate: block.timestamp,
            maturityDate: block.timestamp + maturityPeriod,
            producer: msg.sender,
            ready: false
        });

        batchesByProducer[msg.sender].push(batchId);

        emit CompostBatchCreated(batchId, msg.sender, quantity);
        return batchId;
    }

    function markAsReady(uint256 batchId) public {
        require(compostBatches[batchId].producer == msg.sender, "Not the producer");
        require(block.timestamp >= compostBatches[batchId].maturityDate, "Not mature yet");
        compostBatches[batchId].ready = true;
        emit CompostReady(batchId);
    }

    function getBatch(uint256 batchId) public view returns (CompostBatch memory) {
        return compostBatches[batchId];
    }
}



