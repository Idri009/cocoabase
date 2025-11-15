// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmGreenhouseManagement
 * @dev Greenhouse operations management with environmental control tracking
 */
contract FarmGreenhouseManagement is Ownable {
    struct Greenhouse {
        uint256 greenhouseId;
        address owner;
        string location;
        uint256 temperature;
        uint256 humidity;
        uint256 co2Level;
        uint256 lastUpdate;
        bool automated;
    }

    mapping(uint256 => Greenhouse) public greenhouses;
    mapping(address => uint256[]) public greenhousesByOwner;
    uint256 private _greenhouseIdCounter;

    event GreenhouseRegistered(
        uint256 indexed greenhouseId,
        address indexed owner,
        string location
    );

    event ConditionsUpdated(
        uint256 indexed greenhouseId,
        uint256 temperature,
        uint256 humidity
    );

    constructor() Ownable(msg.sender) {}

    function registerGreenhouse(
        string memory location,
        uint256 temperature,
        uint256 humidity,
        uint256 co2Level,
        bool automated
    ) public returns (uint256) {
        uint256 greenhouseId = _greenhouseIdCounter++;
        greenhouses[greenhouseId] = Greenhouse({
            greenhouseId: greenhouseId,
            owner: msg.sender,
            location: location,
            temperature: temperature,
            humidity: humidity,
            co2Level: co2Level,
            lastUpdate: block.timestamp,
            automated: automated
        });

        greenhousesByOwner[msg.sender].push(greenhouseId);
        emit GreenhouseRegistered(greenhouseId, msg.sender, location);
        return greenhouseId;
    }

    function updateConditions(
        uint256 greenhouseId,
        uint256 temperature,
        uint256 humidity,
        uint256 co2Level
    ) public {
        require(greenhouses[greenhouseId].owner == msg.sender, "Not authorized");
        greenhouses[greenhouseId].temperature = temperature;
        greenhouses[greenhouseId].humidity = humidity;
        greenhouses[greenhouseId].co2Level = co2Level;
        greenhouses[greenhouseId].lastUpdate = block.timestamp;
        emit ConditionsUpdated(greenhouseId, temperature, humidity);
    }

    function getGreenhouse(uint256 greenhouseId) public view returns (Greenhouse memory) {
        return greenhouses[greenhouseId];
    }
}
