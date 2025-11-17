// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockFeedQualityTesting
 * @dev Feed quality testing and analysis tracking
 */
contract FarmLivestockFeedQualityTesting is Ownable {
    struct QualityTest {
        uint256 testId;
        address farmer;
        string feedBatch;
        uint256 proteinContent;
        uint256 moistureContent;
        uint256 testDate;
        bool passed;
    }

    mapping(uint256 => QualityTest) public tests;
    uint256 private _testIdCounter;

    event TestRecorded(
        uint256 indexed testId,
        address indexed farmer,
        bool passed
    );

    constructor() Ownable(msg.sender) {}

    function recordTest(
        string memory feedBatch,
        uint256 proteinContent,
        uint256 moistureContent
    ) public returns (uint256) {
        bool passed = proteinContent >= 15 && moistureContent <= 14;
        uint256 testId = _testIdCounter++;
        tests[testId] = QualityTest({
            testId: testId,
            farmer: msg.sender,
            feedBatch: feedBatch,
            proteinContent: proteinContent,
            moistureContent: moistureContent,
            testDate: block.timestamp,
            passed: passed
        });

        emit TestRecorded(testId, msg.sender, passed);
        return testId;
    }

    function getTest(uint256 testId) public view returns (QualityTest memory) {
        return tests[testId];
    }
}