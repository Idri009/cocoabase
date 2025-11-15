// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmBlockchainDataVerification
 * @dev Onchain data verification and tamper-proof record system
 */
contract FarmBlockchainDataVerification is Ownable {
    struct VerifiedData {
        uint256 dataId;
        address submitter;
        string dataHash;
        string dataType;
        uint256 timestamp;
        bool verified;
        address verifier;
    }

    mapping(uint256 => VerifiedData) public verifiedData;
    mapping(string => uint256) public hashToDataId;
    mapping(address => uint256[]) public dataBySubmitter;
    uint256 private _dataIdCounter;

    event DataSubmitted(
        uint256 indexed dataId,
        address indexed submitter,
        string dataHash
    );

    event DataVerified(
        uint256 indexed dataId,
        address indexed verifier
    );

    constructor() Ownable(msg.sender) {}

    function submitData(
        string memory dataHash,
        string memory dataType
    ) public returns (uint256) {
        require(hashToDataId[dataHash] == 0, "Data already submitted");
        uint256 dataId = _dataIdCounter++;
        verifiedData[dataId] = VerifiedData({
            dataId: dataId,
            submitter: msg.sender,
            dataHash: dataHash,
            dataType: dataType,
            timestamp: block.timestamp,
            verified: false,
            verifier: address(0)
        });

        hashToDataId[dataHash] = dataId;
        dataBySubmitter[msg.sender].push(dataId);
        emit DataSubmitted(dataId, msg.sender, dataHash);
        return dataId;
    }

    function verifyData(uint256 dataId) public onlyOwner {
        require(!verifiedData[dataId].verified, "Already verified");
        verifiedData[dataId].verified = true;
        verifiedData[dataId].verifier = msg.sender;
        emit DataVerified(dataId, msg.sender);
    }

    function getData(uint256 dataId) public view returns (VerifiedData memory) {
        return verifiedData[dataId];
    }
}
