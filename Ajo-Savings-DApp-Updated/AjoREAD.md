# Ajo Savings DApp — Project Guide

## 1. Project Overview

The **Ajo Savings DApp** is a decentralized application built to demonstrate how blockchain technology can support a rotating savings system known as *Ajo*, *Esusu*, or *Adashe*.

The system allows three registered members to contribute a fixed amount of Sepolia ETH during each round. Once all three members have contributed, the smart contract transfers the accumulated pot to the designated recipient and advances to the next round.

The application uses Solidity smart contracts, Hardhat for development and testing, Ethers.js for blockchain interaction, and MetaMask for wallet connectivity.

## 2. Project Details

- **Project name:** Ajo Savings DApp
- **Network:** Ethereum Sepolia Testnet
- **Smart contract language:** Solidity
- **Development framework:** Hardhat
- **Frontend:** HTML, CSS, and JavaScript
- **Blockchain interaction:** Ethers.js v6
- **Wallet:** MetaMask

### Deployed Smart Contract

**Active contract address:**

`0x191ECa41A358947aCa11d94FE21f95A96011889b`

**View on Etherscan:**  
https://sepolia.etherscan.io/address/0x191ECa41A358947aCa11d94FE21f95A96011889b

An earlier version of the contract was deployed at:

`0xE8E009ac769747565E1006B4d05F36d88488cb2E`

https://sepolia.etherscan.io/address/0xE8E009ac769747565E1006B4d05F36d88488cb2E

Use the active contract address in the frontend configuration.

## 3. Registered Members

The original project configuration used these three member addresses:

| Member | Wallet Address |
|---|---|
| Member 1 | `0xB0f326bB3602b0A342cfd148B4e72cB524802028` |
| Member 2 | `0x5b3fE5BfD73E0c91848d3E3798dFeFeDE8d7A838` |
| Member 3 | `0x13419B3324a36B2E0E51D29Af0D07cF1D24EBd65` |

Confirm that these addresses match the constructor arguments used for the active deployment.

## 4. How the Savings System Works

1. Three registered members participate in the savings arrangement.
2. Each member contributes the required amount to the smart contract.
3. The contract records each contribution and prevents the same member from contributing twice in the same round.
4. When all three members have contributed, the contract transfers the accumulated pot to the current recipient.
5. The contract advances to the next round and rotates the recipient.
6. The process continues until the savings arrangement is completed.

The original contribution amount was **0.001 Sepolia ETH per member per round**. The actual amount for the active deployment is determined by the contract's `contributionAmount` value.

## 5. Deadline and Missed Contributions

The deadline-enabled version introduces a time limit for each round.

- The contract establishes a deadline when a round begins.
- Members can contribute before or after the deadline, subject to the contract's rules.
- Once the deadline has passed, `markMissedContributions()` can record members who have not yet contributed.
- A member who misses a deadline may be required to pay a double contribution in the following round.
- A late contribution for the current round remains subject to the current round's contribution rules.
- After all required contributions are received, the contract completes the round, transfers the pot, rotates the recipient, and sets the next deadline.

**Important:** Passing the deadline does not automatically complete an unfinished round. All required contributions must still be received before the round can complete under the current contract logic.

## 6. Smart Contract Functions

The deadline-enabled contract includes the following key functions:

| Function | Purpose |
|---|---|
| `getCurrentRecipient()` | Returns the wallet address of the current recipient. |
| `getPotBalance()` | Returns the amount currently held in the savings pot. |
| `getRequiredContribution(address)` | Returns the contribution required from a specified member. |
| `contribute()` | Submits a member's contribution. |
| `markMissedContributions()` | Processes missed deadlines according to the contract rules. |

The contract also tracks the current round, contribution count, recipient index, round deadline, registered members, and missed-round records.

## 7. Frontend Features

The `ajo.html` frontend provides a dashboard for interacting with the smart contract.

Its features include:

- Connecting a MetaMask wallet.
- Displaying the connected wallet address.
- Showing the current round and savings pot balance.
- Displaying the current recipient.
- Showing the contribution deadline and countdown.
- Tracking round contribution progress.
- Displaying the connected member's contribution requirement.
- Submitting contributions through MetaMask.
- Processing missed contributions after a deadline.
- Refreshing the displayed contract information.

The frontend uses Ethers.js v6 to communicate with the deployed contract.

## 8. Project Requirements

Install the following before running the development environment:

- Node.js and npm
- Visual Studio Code or another code editor
- MetaMask browser extension
- Sepolia test ETH for blockchain transactions

## 9. Running the Project Locally

Open PowerShell or the VS Code terminal and navigate to the project folder:

```powershell
cd "$env:USERPROFILE\Desktop\Ajo-Savings-DApp"
```

Install the project dependencies:

```powershell
npm install
```

Compile the smart contracts:

```powershell
npx hardhat compile
```

Run the automated tests:

```powershell
npx hardhat test
```

Open `ajo.html` in a local development server, such as the VS Code Live Server extension, to use the frontend.

Make sure the contract address and ABI in `ajo.html` match the deployed deadline-enabled contract.

## 10. Testing

The project was previously tested in the original development folder, with **14 tests passing**: three Solidity tests and eleven Mocha tests.

The tests cover areas such as:

- Initial recipient selection.
- Member eligibility.
- Incorrect contribution amounts.
- Duplicate contributions.
- Deadline processing.
- Missed-contribution penalties.
- Late contributions.
- Next-round contribution requirements.
- Recipient rotation.

Run the test command in the standalone Desktop folder to confirm that its copied files and dependencies work correctly.

## 11. Environment Variables and Deployment

If the deployment script requires environment variables, create a local `.env` file using the variable names expected by your Hardhat configuration.

Example placeholders:

```text
SEPOLIA_RPC_URL=YOUR_SEPOLIA_RPC_URL
SEPOLIA_PRIVATE_KEY=YOUR_TEST_WALLET_PRIVATE_KEY
```

These are placeholders, not working credentials. Confirm the exact variable names used by your project before configuring them.

**Security warning:** Never commit your `.env` file, private keys, recovery phrases, or other wallet secrets to GitHub.

Deploying the contract again creates a new contract address. It does not update the existing deployment. If you redeploy, update the frontend address and this documentation accordingly.

## 12. Suggested Folder Structure

```text
Ajo-Savings-DApp/
├── AjoREAD.md
├── ajo.html
├── package.json
├── package-lock.json
├── hardhat.config.ts
├── .gitignore
├── .env.example
├── contracts/
│   └── AjoSavings.sol
├── scripts/
│   └── deploy-ajo.js
└── test/
    └── AjoSavings.js
```

Only include files relevant to the Ajo Savings project. Do not copy unrelated coursework, generated build folders, or private configuration files into this standalone project.

## 13. GitHub Checklist

Before uploading the project:

- [ ] Confirm that the contract address in `ajo.html` is correct.
- [ ] Confirm that the ABI matches the deployed contract.
- [ ] Compile the contracts successfully.
- [ ] Run the automated tests.
- [ ] Include `AjoREAD.md`.
- [ ] Include `.env.example` with placeholders only, if needed.
- [ ] Exclude `.env`, `node_modules`, `artifacts`, and `cache`.
- [ ] Check that no private keys or wallet recovery phrases are present.

## 14. Disclaimer

This project is an educational demonstration of a rotating savings system using blockchain technology. It has not been represented as an independently audited financial application.

Use Sepolia test ETH for testing. Do not deposit real funds or rely on the contract for financial savings without a professional security audit and further testing.

---

**Project:** Ajo Savings DApp  
**Developer:** Olarinde Ramat  
**Repository:** https://github.com/Hibiikay/Olarinde-Ramat-Web3-course
