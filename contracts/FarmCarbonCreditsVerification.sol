// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCarbonCreditsVerification
 * @dev Carbon credit verification and validation system
 */
contract FarmCarbonCreditsVerification is Ownable {
    struct CreditVerification {
        uint256 verificationId;
        address farmer;
        uint256 creditId;
        uint256 sequestrationAmount;
        bool verified;
        address verifier;
        uint256 verificationDate;
    }

    mapping(uint256 => CreditVerification) public verifications;
    mapping(address => uint256[]) public verificationsByFarmer;
    uint256 private _verificationIdCounter;

    event VerificationRequested(
        uint256 indexed verificationId,
        address indexed farmer,
        uint256 creditId
    );

    event VerificationCompleted(
        uint256 indexed verificationId,
        bool verified
    );

    constructor() Ownable(msg.sender) {}

    function requestVerification(
        uint256 creditId,
        uint256 sequestrationAmount
    ) public returns (uint256) {
        uint256 verificationId = _verificationIdCounter++;
        verifications[verificationId] = CreditVerification({
            verificationId: verificationId,
            farmer: msg.sender,
            creditId: creditId,
            sequestrationAmount: sequestrationAmount,
            verified: false,
            verifier: address(0),
            verificationDate: 0
        });

        verificationsByFarmer[msg.sender].push(verificationId);
        emit VerificationRequested(verificationId, msg.sender, creditId);
        return verificationId;
    }

    function completeVerification(uint256 verificationId, bool verified) public onlyOwner {
        verifications[verificationId].verified = verified;
        verifications[verificationId].verifier = msg.sender;
        verifications[verificationId].verificationDate = block.timestamp;
        emit VerificationCompleted(verificationId, verified);
    }

    function getVerification(uint256 verificationId) public view returns (CreditVerification memory) {
        return verifications[verificationId];
    }
}
