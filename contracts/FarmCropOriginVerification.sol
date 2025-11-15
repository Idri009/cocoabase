// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmCropOriginVerification
 * @dev Onchain system for verifying and certifying crop origin
 */
contract FarmCropOriginVerification is Ownable {
    struct OriginVerification {
        uint256 verificationId;
        uint256 cropId;
        address originFarm;
        string geographicLocation;
        string coordinates;
        bool verified;
        address verifier;
    }

    mapping(uint256 => OriginVerification) public originVerifications;
    mapping(address => uint256[]) public verificationsByFarm;
    uint256 private _verificationIdCounter;

    event OriginVerified(
        uint256 indexed verificationId,
        address indexed verifier,
        address originFarm
    );

    constructor() Ownable(msg.sender) {}

    function registerOrigin(
        uint256 cropId,
        address originFarm,
        string memory geographicLocation,
        string memory coordinates
    ) public returns (uint256) {
        uint256 verificationId = _verificationIdCounter++;
        originVerifications[verificationId] = OriginVerification({
            verificationId: verificationId,
            cropId: cropId,
            originFarm: originFarm,
            geographicLocation: geographicLocation,
            coordinates: coordinates,
            verified: false,
            verifier: address(0)
        });

        verificationsByFarm[originFarm].push(verificationId);

        return verificationId;
    }

    function verifyOrigin(uint256 verificationId) public onlyOwner {
        require(!originVerifications[verificationId].verified, "Already verified");
        originVerifications[verificationId].verified = true;
        originVerifications[verificationId].verifier = msg.sender;

        emit OriginVerified(verificationId, msg.sender, originVerifications[verificationId].originFarm);
    }

    function getVerification(uint256 verificationId) public view returns (OriginVerification memory) {
        return originVerifications[verificationId];
    }
}

