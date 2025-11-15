// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLandTitleVerification
 * @dev Onchain land title verification and ownership records
 */
contract FarmLandTitleVerification is Ownable {
    struct LandTitle {
        uint256 titleId;
        address owner;
        string parcelId;
        string location;
        uint256 area;
        string coordinates;
        uint256 registrationDate;
        bool isVerified;
        address verifier;
    }

    mapping(uint256 => LandTitle) public titles;
    mapping(address => uint256[]) public titlesByOwner;
    mapping(string => uint256) public titlesByParcelId;
    uint256 private _titleIdCounter;

    event TitleRegistered(
        uint256 indexed titleId,
        address indexed owner,
        string parcelId
    );

    event TitleVerified(
        uint256 indexed titleId,
        address indexed verifier
    );

    event TitleTransferred(
        uint256 indexed titleId,
        address indexed from,
        address indexed to
    );

    constructor() Ownable(msg.sender) {}

    function registerTitle(
        string memory parcelId,
        string memory location,
        uint256 area,
        string memory coordinates
    ) public returns (uint256) {
        require(titlesByParcelId[parcelId] == 0, "Parcel already registered");

        uint256 titleId = _titleIdCounter++;
        titles[titleId] = LandTitle({
            titleId: titleId,
            owner: msg.sender,
            parcelId: parcelId,
            location: location,
            area: area,
            coordinates: coordinates,
            registrationDate: block.timestamp,
            isVerified: false,
            verifier: address(0)
        });

        titlesByOwner[msg.sender].push(titleId);
        titlesByParcelId[parcelId] = titleId;

        emit TitleRegistered(titleId, msg.sender, parcelId);
        return titleId;
    }

    function verifyTitle(uint256 titleId) public onlyOwner {
        require(!titles[titleId].isVerified, "Title already verified");
        titles[titleId].isVerified = true;
        titles[titleId].verifier = msg.sender;

        emit TitleVerified(titleId, msg.sender);
    }

    function transferTitle(uint256 titleId, address newOwner) public {
        require(titles[titleId].owner == msg.sender, "Not title owner");
        require(newOwner != address(0), "Invalid new owner");

        address oldOwner = titles[titleId].owner;
        titles[titleId].owner = newOwner;

        emit TitleTransferred(titleId, oldOwner, newOwner);
    }

    function getTitle(uint256 titleId) public view returns (LandTitle memory) {
        return titles[titleId];
    }
}

