// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropSeedViability
 * @dev Seed viability testing system
 */
contract FarmCropSeedViability is Ownable {
    struct ViabilityTest {
        uint256 testId;
        address tester;
        string seedVariety;
        uint256 viabilityRate;
        bool viable;
        uint256 timestamp;
    }

    mapping(uint256 => ViabilityTest) public tests;
    mapping(address => uint256[]) public testsByTester;
    mapping(address => bool) public isTester;
    uint256 private _testIdCounter;

    event TestPerformed(uint256 indexed testId, bool viable);
    event TesterAdded(address indexed tester);

    constructor() Ownable(msg.sender) {
        isTester[msg.sender] = true;
    }

    function addTester(address tester) public onlyOwner {
        isTester[tester] = true;
        emit TesterAdded(tester);
    }

    function performTest(
        string memory seedVariety,
        uint256 viabilityRate
    ) public returns (uint256) {
        require(isTester[msg.sender], "Not a tester");
        require(viabilityRate <= 100, "Invalid rate");
        bool viable = viabilityRate >= 80;
        uint256 testId = _testIdCounter++;
        tests[testId] = ViabilityTest({
            testId: testId,
            tester: msg.sender,
            seedVariety: seedVariety,
            viabilityRate: viabilityRate,
            viable: viable,
            timestamp: block.timestamp
        });
        testsByTester[msg.sender].push(testId);
        emit TestPerformed(testId, viable);
        return testId;
    }
}
