// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLandTitleVerification
 * @dev Land title verification and ownership records
 */
contract FarmLandTitleVerification is Ownable {
    struct LandTitle {
        uint256 titleId;
        address owner;
        string location;
        uint256 area;
        bytes32 documentHash;
        bool verified;
        address verifier;
    }

    mapping(uint256 => LandTitle) public titles;
    mapping(address => uint256[]) public titlesByOwner;
    mapping(address => bool) public isVerifier;
    uint256 private _titleIdCounter;

    event TitleRegistered(uint256 indexed titleId, address indexed owner);
    event TitleVerified(uint256 indexed titleId, address indexed verifier);
    event VerifierAdded(address indexed verifier);

    constructor() Ownable(msg.sender) {
        isVerifier[msg.sender] = true;
    }

    function addVerifier(address verifier) public onlyOwner {
        isVerifier[verifier] = true;
        emit VerifierAdded(verifier);
    }

    function registerTitle(
        string memory location,
        uint256 area,
        bytes32 documentHash
    ) public returns (uint256) {
        uint256 titleId = _titleIdCounter++;
        titles[titleId] = LandTitle({
            titleId: titleId,
            owner: msg.sender,
            location: location,
            area: area,
            documentHash: documentHash,
            verified: false,
            verifier: address(0)
        });
        titlesByOwner[msg.sender].push(titleId);
        emit TitleRegistered(titleId, msg.sender);
        return titleId;
    }

    function verifyTitle(uint256 titleId) public {
        require(isVerifier[msg.sender], "Not a verifier");
        require(!titles[titleId].verified, "Already verified");
        titles[titleId].verified = true;
        titles[titleId].verifier = msg.sender;
        emit TitleVerified(titleId, msg.sender);
    }
}
