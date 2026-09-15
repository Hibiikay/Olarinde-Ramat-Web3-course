// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SecureVault is Ownable {

    // Tracks how much ETH each wallet has deposited
    mapping(address => uint256) public balances;

    // Anyone can deposit ETH
    function deposit() public payable {
        require(msg.value > 0, "Must deposit ETH");

        balances[msg.sender] += msg.value;
    }

    // Only the owner can withdraw the entire vault balance
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;

        payable(owner()).transfer(balance);
    }

    // Check an individual user's deposited balance
    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }

    // Check the total ETH held by the vault
    function getVaultBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
