// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmLivestockIdentificationTagging
 * @dev Onchain livestock identification tag management and tracking
 */
contract FarmLivestockIdentificationTagging is Ownable {
    struct IdentificationTag {
        uint256 tagId;
        address farmer;
        string livestockId;
        string tagNumber;
        string tagType;
        uint256 taggingDate;
        bool isActive;
    }

    mapping(uint256 => IdentificationTag) public tags;
    mapping(string => uint256) public tagsByTagNumber;
    mapping(address => uint256[]) public tagsByFarmer;
    uint256 private _tagIdCounter;

    event TagAssigned(
        uint256 indexed tagId,
        address indexed farmer,
        string livestockId,
        string tagNumber
    );

    constructor() Ownable(msg.sender) {}

    function assignTag(
        string memory livestockId,
        string memory tagNumber,
        string memory tagType
    ) public returns (uint256) {
        require(tagsByTagNumber[tagNumber] == 0, "Tag number already exists");

        uint256 tagId = _tagIdCounter++;
        tags[tagId] = IdentificationTag({
            tagId: tagId,
            farmer: msg.sender,
            livestockId: livestockId,
            tagNumber: tagNumber,
            tagType: tagType,
            taggingDate: block.timestamp,
            isActive: true
        });

        tagsByTagNumber[tagNumber] = tagId;
        tagsByFarmer[msg.sender].push(tagId);
        emit TagAssigned(tagId, msg.sender, livestockId, tagNumber);
        return tagId;
    }

    function deactivateTag(uint256 tagId) public {
        require(tags[tagId].farmer == msg.sender, "Not tag owner");
        tags[tagId].isActive = false;
    }

    function getTag(uint256 tagId) public view returns (IdentificationTag memory) {
        return tags[tagId];
    }
}

