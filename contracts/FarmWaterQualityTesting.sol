// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmWaterQualityTesting
 * @dev Water quality testing and certification
 */
contract FarmWaterQualityTesting is Ownable {
    struct QualityTest {
        uint256 testId;
        address farmer;
        string waterSource;
        uint256 phLevel;
        uint256 dissolvedOxygen;
        uint256 turbidity;
        uint256 testDate;
        bool meetsStandards;
    }

    mapping(uint256 => QualityTest) public tests;
    uint256 private _testIdCounter;

    event TestRecorded(
        uint256 indexed testId,
        address indexed farmer,
        bool meetsStandards
    );

    constructor() Ownable(msg.sender) {}

    function recordTest(
        string memory waterSource,
        uint256 phLevel,
        uint256 dissolvedOxygen,
        uint256 turbidity
    ) public returns (uint256) {
        bool meetsStandards = phLevel >= 65 && phLevel <= 85 && dissolvedOxygen >= 5 && turbidity <= 10;
        uint256 testId = _testIdCounter++;
        tests[testId] = QualityTest({
            testId: testId,
            farmer: msg.sender,
            waterSource: waterSource,
            phLevel: phLevel,
            dissolvedOxygen: dissolvedOxygen,
            turbidity: turbidity,
            testDate: block.timestamp,
            meetsStandards: meetsStandards
        });

        emit TestRecorded(testId, msg.sender, meetsStandards);
        return testId;
    }

    function getTest(uint256 testId) public view returns (QualityTest memory) {
        return tests[testId];
    }
}
