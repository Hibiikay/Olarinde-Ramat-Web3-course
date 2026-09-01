// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    address public owner;
    string private message;

    constructor(string memory initialMessage) {
        owner = msg.sender;
        message = initialMessage;
    }

    // Anyone can read the stored message
    function getMessage() public view returns (string memory) {
        return message;
    }

    // Only the owner can update the message
    function setMessage(string memory newMessage) public {
        require(msg.sender == owner, "Only owner can update message");
        message = newMessage;
    }
}
