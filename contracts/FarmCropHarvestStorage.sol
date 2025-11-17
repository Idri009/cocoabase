// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropHarvestStorage
 * @dev Harvest storage management and inventory tracking
 */
contract FarmCropHarvestStorage is Ownable {
    struct StorageUnit {
        uint256 unitId;
        address farmer;
        string harvestId;
        string storageLocation;
        uint256 quantity;
        uint256 storageDate;
        uint256 expiryDate;
    }

    mapping(uint256 => StorageUnit) public storageUnits;
    uint256 private _unitIdCounter;

    event UnitCreated(
        uint256 indexed unitId,
        address indexed farmer,
        string storageLocation
    );

    constructor() Ownable(msg.sender) {}

    function createStorage(
        string memory harvestId,
        string memory storageLocation,
        uint256 quantity,
        uint256 expiryDate
    ) public returns (uint256) {
        uint256 unitId = _unitIdCounter++;
        storageUnits[unitId] = StorageUnit({
            unitId: unitId,
            farmer: msg.sender,
            harvestId: harvestId,
            storageLocation: storageLocation,
            quantity: quantity,
            storageDate: block.timestamp,
            expiryDate: expiryDate
        });

        emit UnitCreated(unitId, msg.sender, storageLocation);
        return unitId;
    }

    function updateQuantity(uint256 unitId, uint256 newQuantity) public {
        require(storageUnits[unitId].farmer == msg.sender, "Not authorized");
        storageUnits[unitId].quantity = newQuantity;
    }

    function getStorage(uint256 unitId) public view returns (StorageUnit memory) {
        return storageUnits[unitId];
    }
}