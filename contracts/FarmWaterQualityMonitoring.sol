// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWaterQualityMonitoring
 * @dev Water quality monitoring system
 */
contract FarmWaterQualityMonitoring is Ownable {
    struct QualityTest {
        uint256 testId;
        address tester;
        uint256 sourceId;
        uint256 phLevel;
        uint256 contaminationLevel;
        uint256 timestamp;
        bool safe;
    }

    mapping(uint256 => QualityTest) public qualityTests;
    mapping(uint256 => uint256[]) public testsBySource;
    mapping(address => uint256[]) public testsByTester;
    uint256 private _testIdCounter;

    event QualityTestRecorded(
        uint256 indexed testId,
        uint256 sourceId,
        bool safe
    );

    constructor() Ownable(msg.sender) {}

    function recordTest(
        uint256 sourceId,
        uint256 phLevel,
        uint256 contaminationLevel
    ) public returns (uint256) {
        bool safe = phLevel >= 6 && phLevel <= 8 && contaminationLevel < 50;
        uint256 testId = _testIdCounter++;
        qualityTests[testId] = QualityTest({
            testId: testId,
            tester: msg.sender,
            sourceId: sourceId,
            phLevel: phLevel,
            contaminationLevel: contaminationLevel,
            timestamp: block.timestamp,
            safe: safe
        });
        testsBySource[sourceId].push(testId);
        testsByTester[msg.sender].push(testId);
        emit QualityTestRecorded(testId, sourceId, safe);
        return testId;
    }

    function getLatestTest(uint256 sourceId) public view returns (QualityTest memory) {
        require(testsBySource[sourceId].length > 0, "No tests found");
        uint256 latestId = testsBySource[sourceId][testsBySource[sourceId].length - 1];
        return qualityTests[latestId];
    }
}
