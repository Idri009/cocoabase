// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropSeedViability
 * @dev Seed viability testing and tracking
 */
contract FarmCropSeedViability is Ownable {
    struct ViabilityTest {
        uint256 testId;
        address farmer;
        string seedBatch;
        uint256 germinationRate;
        uint256 testDate;
        bool viable;
    }

    mapping(uint256 => ViabilityTest) public tests;
    uint256 private _testIdCounter;

    event TestRecorded(
        uint256 indexed testId,
        address indexed farmer,
        uint256 germinationRate
    );

    constructor() Ownable(msg.sender) {}

    function recordTest(
        string memory seedBatch,
        uint256 germinationRate
    ) public returns (uint256) {
        bool viable = germinationRate >= 80;
        uint256 testId = _testIdCounter++;
        tests[testId] = ViabilityTest({
            testId: testId,
            farmer: msg.sender,
            seedBatch: seedBatch,
            germinationRate: germinationRate,
            testDate: block.timestamp,
            viable: viable
        });

        emit TestRecorded(testId, msg.sender, germinationRate);
        return testId;
    }

    function getTest(uint256 testId) public view returns (ViabilityTest memory) {
        return tests[testId];
    }
}
