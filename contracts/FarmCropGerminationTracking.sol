// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropGerminationTracking
 * @dev Onchain tracking of seed germination rates and success metrics
 */
contract FarmCropGerminationTracking is Ownable {
    struct GerminationBatch {
        uint256 batchId;
        address farmer;
        string cropType;
        uint256 seedsPlanted;
        uint256 seedsGerminated;
        uint256 germinationDate;
        uint256 successRate;
        bool verified;
    }

    mapping(uint256 => GerminationBatch) public batches;
    mapping(address => uint256[]) public batchesByFarmer;
    uint256 private _batchIdCounter;

    event BatchRecorded(
        uint256 indexed batchId,
        address indexed farmer,
        string cropType,
        uint256 successRate
    );

    constructor() Ownable(msg.sender) {}

    function recordGermination(
        string memory cropType,
        uint256 seedsPlanted,
        uint256 seedsGerminated,
        uint256 germinationDate
    ) public returns (uint256) {
        require(seedsGerminated <= seedsPlanted, "Invalid germination count");
        uint256 successRate = (seedsGerminated * 10000) / seedsPlanted;

        uint256 batchId = _batchIdCounter++;
        batches[batchId] = GerminationBatch({
            batchId: batchId,
            farmer: msg.sender,
            cropType: cropType,
            seedsPlanted: seedsPlanted,
            seedsGerminated: seedsGerminated,
            germinationDate: germinationDate,
            successRate: successRate,
            verified: false
        });

        batchesByFarmer[msg.sender].push(batchId);
        emit BatchRecorded(batchId, msg.sender, cropType, successRate);
        return batchId;
    }

    function verifyBatch(uint256 batchId) public onlyOwner {
        batches[batchId].verified = true;
    }

    function getBatch(uint256 batchId) public view returns (GerminationBatch memory) {
        return batches[batchId];
    }
}