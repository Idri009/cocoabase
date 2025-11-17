// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropPollinationServices
 * @dev Pollination service marketplace
 */
contract FarmCropPollinationServices is Ownable {
    struct Service {
        uint256 serviceId;
        address provider;
        address farmer;
        uint256 fieldId;
        uint256 price;
        bool completed;
    }

    mapping(uint256 => Service) public services;
    mapping(address => uint256[]) public servicesByProvider;
    mapping(address => uint256[]) public servicesByFarmer;
    uint256 private _serviceIdCounter;

    event ServiceCreated(uint256 indexed serviceId, address indexed provider);
    event ServiceCompleted(uint256 indexed serviceId);

    constructor() Ownable(msg.sender) {}

    function createService(
        address farmer,
        uint256 fieldId,
        uint256 price
    ) public returns (uint256) {
        uint256 serviceId = _serviceIdCounter++;
        services[serviceId] = Service({
            serviceId: serviceId,
            provider: msg.sender,
            farmer: farmer,
            fieldId: fieldId,
            price: price,
            completed: false
        });
        servicesByProvider[msg.sender].push(serviceId);
        servicesByFarmer[farmer].push(serviceId);
        emit ServiceCreated(serviceId, msg.sender);
        return serviceId;
    }

    function completeService(uint256 serviceId) public payable {
        Service storage service = services[serviceId];
        require(service.farmer == msg.sender, "Not the farmer");
        require(!service.completed, "Already completed");
        require(msg.value >= service.price, "Insufficient payment");
        service.completed = true;
        payable(service.provider).transfer(service.price);
        emit ServiceCompleted(serviceId);
    }
}

