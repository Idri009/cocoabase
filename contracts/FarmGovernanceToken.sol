// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmGovernanceToken
 * @dev ERC-20 governance token for cooperative decision-making
 */
contract FarmGovernanceToken is ERC20, Ownable {
    mapping(address => bool) public minters;
    uint256 public maxSupply = 1000000000 * 10**18;

    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);

    constructor() ERC20("Farm Governance Token", "FGT") Ownable(msg.sender) {
        minters[msg.sender] = true;
    }

    function addMinter(address minter) public onlyOwner {
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    function removeMinter(address minter) public onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    function mint(address to, uint256 amount) public {
        require(minters[msg.sender], "Not a minter");
        require(totalSupply() + amount <= maxSupply, "Exceeds max supply");
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}

