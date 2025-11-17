// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropVarietyTesting
 * @dev Crop variety testing and evaluation
 */
contract FarmCropVarietyTesting is Ownable {
    struct VarietyTest {
        uint256 testId;
        address tester;
        string varietyName;
        uint256 yield;
        uint256 quality;
        uint256 resistance;
        bool approved;
    }

    mapping(uint256 => VarietyTest) public tests;
    mapping(address => uint256[]) public testsByTester;
    mapping(address => bool) public isTester;
    uint256 private _testIdCounter;

    event TestCreated(uint256 indexed testId, string varietyName);
    event TestApproved(uint256 indexed testId);

    constructor() Ownable(msg.sender) {
        isTester[msg.sender] = true;
    }

    function addTester(address tester) public onlyOwner {
        isTester[tester] = true;
    }

    function createTest(
        string memory varietyName,
        uint256 yield,
        uint256 quality,
        uint256 resistance
    ) public returns (uint256) {
        require(isTester[msg.sender], "Not a tester");
        uint256 testId = _testIdCounter++;
        tests[testId] = VarietyTest({
            testId: testId,
            tester: msg.sender,
            varietyName: varietyName,
            yield: yield,
            quality: quality,
            resistance: resistance,
            approved: false
        });
        testsByTester[msg.sender].push(testId);
        emit TestCreated(testId, varietyName);
        return testId;
    }

    function approveTest(uint256 testId) public onlyOwner {
        tests[testId].approved = true;
        emit TestApproved(testId);
    }
}

