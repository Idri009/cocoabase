// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWeatherOracle
 * @dev Decentralized weather data oracle integration
 */
contract FarmWeatherOracle is Ownable {
    struct WeatherData {
        uint256 temperature;
        uint256 humidity;
        uint256 rainfall;
        uint256 windSpeed;
        uint256 timestamp;
        string location;
    }

    mapping(string => WeatherData) public weatherData;
    mapping(address => bool) public isWeatherProvider;
    uint256 public dataStalenessThreshold = 6 hours;

    event WeatherDataUpdated(
        string indexed location,
        uint256 temperature,
        uint256 rainfall,
        uint256 timestamp
    );
    event WeatherProviderAdded(address indexed provider);
    event WeatherProviderRemoved(address indexed provider);

    constructor() Ownable(msg.sender) {}

    function addWeatherProvider(address provider) public onlyOwner {
        isWeatherProvider[provider] = true;
        emit WeatherProviderAdded(provider);
    }

    function updateWeatherData(
        string memory location,
        uint256 temperature,
        uint256 humidity,
        uint256 rainfall,
        uint256 windSpeed
    ) public {
        require(isWeatherProvider[msg.sender], "Not a weather provider");
        weatherData[location] = WeatherData({
            temperature: temperature,
            humidity: humidity,
            rainfall: rainfall,
            windSpeed: windSpeed,
            timestamp: block.timestamp,
            location: location
        });
        emit WeatherDataUpdated(location, temperature, rainfall, block.timestamp);
    }

    function getWeatherData(string memory location) public view returns (WeatherData memory) {
        require(
            block.timestamp - weatherData[location].timestamp <= dataStalenessThreshold,
            "Data too stale"
        );
        return weatherData[location];
    }
}


