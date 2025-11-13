// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmEquipmentMaintenance
 * @dev Onchain equipment maintenance scheduling and tracking
 */
contract FarmEquipmentMaintenance is Ownable {
    struct MaintenanceRecord {
        uint256 equipmentId;
        string equipmentType;
        uint256 scheduledDate;
        uint256 completedDate;
        string maintenanceType;
        string description;
        address maintainer;
        bool completed;
        uint256 cost;
    }

    mapping(uint256 => MaintenanceRecord) public maintenanceRecords;
    mapping(address => uint256[]) public equipmentByOwner;
    uint256 private _recordIdCounter;

    event MaintenanceScheduled(
        uint256 indexed recordId,
        address indexed owner,
        uint256 equipmentId,
        uint256 scheduledDate
    );

    event MaintenanceCompleted(
        uint256 indexed recordId,
        address indexed maintainer,
        uint256 completedDate
    );

    constructor() Ownable(msg.sender) {}

    function scheduleMaintenance(
        uint256 equipmentId,
        string memory equipmentType,
        uint256 scheduledDate,
        string memory maintenanceType,
        string memory description,
        uint256 cost
    ) public returns (uint256) {
        uint256 recordId = _recordIdCounter++;
        maintenanceRecords[recordId] = MaintenanceRecord({
            equipmentId: equipmentId,
            equipmentType: equipmentType,
            scheduledDate: scheduledDate,
            completedDate: 0,
            maintenanceType: maintenanceType,
            description: description,
            maintainer: msg.sender,
            completed: false,
            cost: cost
        });

        equipmentByOwner[msg.sender].push(equipmentId);

        emit MaintenanceScheduled(recordId, msg.sender, equipmentId, scheduledDate);
        return recordId;
    }

    function completeMaintenance(uint256 recordId) public {
        require(!maintenanceRecords[recordId].completed, "Already completed");
        maintenanceRecords[recordId].completed = true;
        maintenanceRecords[recordId].completedDate = block.timestamp;
        maintenanceRecords[recordId].maintainer = msg.sender;

        emit MaintenanceCompleted(recordId, msg.sender, block.timestamp);
    }

    function getMaintenanceRecord(uint256 recordId) public view returns (MaintenanceRecord memory) {
        return maintenanceRecords[recordId];
    }

    function getEquipmentByOwner(address owner) public view returns (uint256[] memory) {
        return equipmentByOwner[owner];
    }
}

