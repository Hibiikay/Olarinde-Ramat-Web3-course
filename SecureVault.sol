// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SecureVault is Ownable {

    // Anyone can deposit ETH
    function deposit() public payable {
    }

    // Only the owner can withdraw the entire balance
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;

        payable(owner()).transfer(balance);
    }

    // Check the vault balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
