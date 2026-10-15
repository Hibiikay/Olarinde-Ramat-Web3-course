# Ajo Savings DApp — Rotating Savings Smart Contract

A decentralized rotating savings application built with Solidity, Hardhat 3, Ethers.js, and MetaMask. The project digitizes the traditional Nigerian **Ajo / Esusu / Adashe** savings system, allowing three members to contribute equal amounts of ETH each round while the smart contract automatically transfers the pooled funds to the designated recipient.

## Project Overview

Traditional rotating savings groups rely on trust, manual record-keeping, and coordination among members. This project demonstrates how a smart contract can automate contribution tracking, enforce equal contributions, prevent duplicate contributions within a round, and rotate payouts transparently.

The application was developed as part of the CS62A Web3 coursework.

## Features

- **Three-member savings group:** Three distinct wallet addresses are registered when the contract is deployed.
- **Equal contributions:** Each member must contribute exactly the configured amount per round.
- **Membership validation:** Only registered members can contribute.
- **Duplicate prevention:** Each member can contribute only once per round.
- **Automatic payout:** After all three members contribute, the contract automatically transfers the pooled funds to the current recipient.
- **Automatic rotation:** The recipient advances to the next member after each completed round.
- **Round tracking:** The contract maintains the current round and contribution count.
- **MetaMask integration:** Members connect their wallets to interact with the contract.
- **Transaction confirmation:** The frontend waits for blockchain transaction confirmation and displays status messages.
- **Testnet deployment:** The smart contract was deployed and tested on Ethereum Sepolia.

## Technology Stack

| Technology | Purpose |
|---|---|
| Solidity 0.8.34 | Smart contract development |
| Hardhat 3 | Compilation, testing, and deployment |
| JavaScript | Deployment scripts and frontend logic |
| Ethers.js 6 | Blockchain interaction in the Ajo frontend |
| MetaMask | Wallet connection and transaction signing |
| HTML and CSS | User interface |
| Ethereum Sepolia | Smart contract testnet |
| Etherscan | Contract and transaction inspection |

## How It Works

The savings group has three registered members. Each member contributes **0.001 test ETH per round**.

| Round | Recipient | Total payout |
|---|---|---|
| Round 1 | Member 1 | 0.003 ETH |
| Round 2 | Member 2 | 0.003 ETH |
| Round 3 | Member 3 | 0.003 ETH |

After all three contributions are received, the contract automatically sends the pooled amount to the recipient for that round and advances to the next recipient.

The completed rounds above describe the intended rotation. Actual transaction details can be verified using the contract address and its transaction history.

## Sepolia Deployment

**Network:** Ethereum Sepolia  
**Chain ID:** 11155111  
**Contract address:** `0xE8E009ac769747565E1006B4d05F36d88488cb2E`

- [View contract on Sepolia Etherscan](https://sepolia.etherscan.io/address/0xE8E009ac769747565E1006B4d05F36d88488cb2E)
- [View contract transactions](https://sepolia.etherscan.io/address/0xE8E009ac769747565E1006B4d05F36d88488cb2E#transactions)

The contract was deployed with three distinct member addresses. The first recipient was Member 1, and subsequent payouts rotated to Members 2 and 3.

The deployed contribution amount is 0.001 test ETH per member per round.

**Note:** Sepolia ETH is test currency and has no intended real-world monetary value.

## Getting Started

### Prerequisites

Install or prepare the following:

- Node.js and npm
- MetaMask browser extension
- Git
- A code editor such as Visual Studio Code
- Sepolia test ETH for deployment and transaction fees

### 1. Clone the repository

```bash
git clone https://github.com/Hibiikay/Olarinde-Ramat-Web3-course.git
cd Olarinde-Ramat-Web3-course
```

If the project is stored in a subfolder, navigate into the relevant project folder before running the commands below.

### 2. Install dependencies

```bash
npm install
npm install dotenv
```

### 3. Configure environment variables

Create a local `.env` file in the project root:

```dotenv
SEPOLIA_RPC_URL="YOUR_SEPOLIA_RPC_ENDPOINT"
SEPOLIA_PRIVATE_KEY="YOUR_DEPLOYMENT_WALLET_PRIVATE_KEY"
```

Replace the placeholders with your own values if you intend to deploy again.

**Security:** Never commit `.env`, private keys, or wallet recovery phrases to GitHub. Ensure `.env` is included in `.gitignore`. The deployed contract can be interacted with without exposing the deployer's private key.

### 4. Compile the contracts

```bash
npx hardhat compile
```

### 5. Run the tests

```bash
npx hardhat test
```

The project tests cover the Ajo Savings contract's recipient initialization, membership validation, contribution amount validation, duplicate contribution prevention, payout, and round rotation. The repository also includes tests for the existing MessageBoard and Counter coursework projects.

### 6. Deploy to Sepolia

If you want to deploy a new instance, configure the three member addresses in `scripts/deploy-ajo.js`, then run:

```bash
npx hardhat run scripts/deploy-ajo.js --network sepolia
```

Save the new contract address printed in the terminal. A new deployment creates a separate contract instance; it does not replace the already deployed instance.

### 7. Run the frontend

Open `ajo.html` using Visual Studio Code Live Server or another local web server.

1. Switch MetaMask to Ethereum Sepolia.
2. Connect one of the three registered member wallets.
3. Check the current round, contribution amount, recipient, and contribution status.
4. Click the contribution button and approve the transaction in MetaMask.
5. Wait for confirmation before checking the updated round details.

Only the three addresses registered in the deployed contract can contribute.

## Project Structure

```text
Ajo-Savings-DApp/
├── contracts/
│   ├── AjoSavings.sol
├── scripts/
│   ├── deploy-ajo.js
├── test/
│   ├── AjoSavings.js
├── ajo.html
├── hardhat.config.ts
├── package.json
├── package-lock.json
├── .gitignore
└── Ajo README.md
```

The structure above illustrates the main files. Keep the actual filenames and folder structure consistent with your repository.

## Testing and Results

The Ajo Savings test suite verifies that:

- Member 1 is the first recipient when the contract is deployed.
- Unregistered addresses cannot contribute.
- Contributions with an incorrect amount are rejected.
- A member cannot contribute twice in the same round.
- The first completed round pays Member 1 and advances to Member 2.
- The second completed round pays Member 2 and advances to Member 3.

The project also includes a third-round rotation. The completed three-round flow was tested on Sepolia, with the recipient rotating through all three members.

## Security and Limitations

- This is an educational project deployed to a test network, not a production financial application.
- The contract requires all three members to contribute before a payout can occur.
- There is no deadline or missed-contribution recovery mechanism in the current implementation.
- The contract does not provide an administrative withdrawal function.
- Smart contract security audits and further testing would be necessary before handling real funds.
- The frontend depends on MetaMask, network configuration, and access to an Ethereum RPC provider.

## Future Improvements

Potential enhancements include:

- Contribution deadlines and missed-payment handling.
- Clearer transaction history and payout receipts.
- Improved error handling and network validation.
- Automated contract verification on Etherscan.
- More comprehensive automated tests and deployment documentation.
- A more accessible, mobile-friendly interface.

## Author

**Olarinde Ramat**

Web3 coursework project — Ajo / Esusu rotating savings DApp.

GitHub: [Hibiikay](https://github.com/Hibiikay)

## Disclaimer

This project is intended for learning and demonstration purposes. It uses test ETH on Ethereum Sepolia and should not be used to manage real funds without a professional security review.
