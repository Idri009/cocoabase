// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropHarvestTiming
 * @dev Optimal harvest timing prediction system
 */
contract FarmCropHarvestTiming is Ownable {
    struct HarvestWindow {
        uint256 windowId;
        uint256 cropId;
        uint256 optimalStart;
        uint256 optimalEnd;
        uint256 maturityScore;
    }

    mapping(uint256 => HarvestWindow) public harvestWindows;
    mapping(uint256 => uint256[]) public windowsByCrop;
    uint256 private _windowIdCounter;

    event WindowCreated(uint256 indexed windowId, uint256 cropId);

    constructor() Ownable(msg.sender) {}

    function createWindow(
        uint256 cropId,
        uint256 optimalStart,
        uint256 optimalEnd,
        uint256 maturityScore
    ) public returns (uint256) {
        require(optimalStart < optimalEnd, "Invalid window");
        uint256 windowId = _windowIdCounter++;
        harvestWindows[windowId] = HarvestWindow({
            windowId: windowId,
            cropId: cropId,
            optimalStart: optimalStart,
            optimalEnd: optimalEnd,
            maturityScore: maturityScore
        });
        windowsByCrop[cropId].push(windowId);
        emit WindowCreated(windowId, cropId);
        return windowId;
    }
}
