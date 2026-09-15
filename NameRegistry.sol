// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NameRegistry {
    // Stores the name registered by each wallet address
    mapping(address => string) private names;

    // Event emitted whenever a new name is registered
    event NameRegistered(address indexed user, string name);

    // Register a name once
    function registerName(string memory name) public {
        require(bytes(names[msg.sender]).length == 0, "Name already registered");
        require(bytes(name).length > 0, "Name cannot be empty");

        names[msg.sender] = name;

        emit NameRegistered(msg.sender, name);
    }

    // Anyone can look up a name by wallet address
    function getName(address user) public view returns (string memory) {
        return names[user];
    }
}
