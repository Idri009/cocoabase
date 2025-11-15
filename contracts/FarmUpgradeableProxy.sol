// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarmUpgradeableProxy
 * @dev Upgradeable proxy pattern for contract evolution
 */
contract FarmUpgradeableProxy is Ownable {
    address public implementation;
    mapping(address => bool) public isUpgrader;

    event ImplementationUpgraded(address indexed oldImplementation, address indexed newImplementation);
    event UpgraderAdded(address indexed upgrader);
    event UpgraderRemoved(address indexed upgrader);

    constructor(address _implementation) Ownable(msg.sender) {
        implementation = _implementation;
        isUpgrader[msg.sender] = true;
    }

    function addUpgrader(address upgrader) public onlyOwner {
        isUpgrader[upgrader] = true;
        emit UpgraderAdded(upgrader);
    }

    function removeUpgrader(address upgrader) public onlyOwner {
        isUpgrader[upgrader] = false;
        emit UpgraderRemoved(upgrader);
    }

    function upgradeImplementation(address newImplementation) public {
        require(isUpgrader[msg.sender] || msg.sender == owner(), "Not authorized");
        require(newImplementation != address(0), "Invalid implementation");
        address oldImplementation = implementation;
        implementation = newImplementation;
        emit ImplementationUpgraded(oldImplementation, newImplementation);
    }

    fallback() external payable {
        address impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    receive() external payable {}
}

