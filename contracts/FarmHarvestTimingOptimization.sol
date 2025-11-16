// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmHarvestTimingOptimization
 * @dev Optimize harvest timing based on multiple factors
 */
contract FarmHarvestTimingOptimization is Ownable {
    struct HarvestWindow {
        uint256 windowId;
        address farmer;
        string cropType;
        uint256 optimalStartDate;
        uint256 optimalEndDate;
        uint256 qualityScore;
        bool harvested;
    }

    mapping(uint256 => HarvestWindow) public windows;
    mapping(address => uint256[]) public windowsByFarmer;
    uint256 private _windowIdCounter;

    event WindowCreated(
        uint256 indexed windowId,
        address indexed farmer,
        uint256 optimalStartDate
    );

    event HarvestExecuted(
        uint256 indexed windowId,
        uint256 actualDate
    );

    constructor() Ownable(msg.sender) {}

    function createWindow(
        string memory cropType,
        uint256 optimalStartDate,
        uint256 optimalEndDate,
        uint256 qualityScore
    ) public returns (uint256) {
        uint256 windowId = _windowIdCounter++;
        windows[windowId] = HarvestWindow({
            windowId: windowId,
            farmer: msg.sender,
            cropType: cropType,
            optimalStartDate: optimalStartDate,
            optimalEndDate: optimalEndDate,
            qualityScore: qualityScore,
            harvested: false
        });

        windowsByFarmer[msg.sender].push(windowId);
        emit WindowCreated(windowId, msg.sender, optimalStartDate);
        return windowId;
    }

    function executeHarvest(uint256 windowId) public {
        require(windows[windowId].farmer == msg.sender, "Not authorized");
        require(!windows[windowId].harvested, "Already harvested");
        windows[windowId].harvested = true;
        emit HarvestExecuted(windowId, block.timestamp);
    }

    function getWindow(uint256 windowId) public view returns (HarvestWindow memory) {
        return windows[windowId];
    }
}
