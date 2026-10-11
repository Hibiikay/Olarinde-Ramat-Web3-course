# MessageBoard dApp

A simple decentralized application (dApp) built with Solidity, Hardhat, Ethers.js v5, and MetaMask. Users can connect their wallet, read the current on-chain message, and update it through a blockchain transaction.

## Features

- Connect a MetaMask wallet.
- Read the current message from a deployed smart contract.
- Update the message through a blockchain transaction.
- Wait for transaction confirmation before updating the interface.
- Handle rejected wallet transactions with a clear error message.
- Test smart contract functionality with automated tests.

## Technologies Used

- Solidity
- Hardhat 3
- JavaScript
- Ethers.js v5
- MetaMask
- HTML and CSS

## Smart Contract

The `MessageBoard` contract provides two main functions:

- `getMessage()` — retrieves the stored message.
- `setMessage(string)` — updates the stored message.

## Getting Started

### Prerequisites

Install Node.js, npm, MetaMask, and Git. You will also need a web browser and a code editor such as Visual Studio Code.

### 1. Install dependencies

Clone this repository and open the project directory in your terminal.

```bash
npm install
```

### 2. Run the tests

```bash
npx hardhat test
```

### 3. Start the local blockchain

Open a terminal in the project directory and run:

```bash
npx hardhat node
```

Keep this terminal running.

### 4. Deploy the smart contract

Open a second terminal and run:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Copy the deployed contract address from the terminal and update `CONTRACT_ADDRESS` in `index.html` if it differs from the address already configured.

### 5. Launch the frontend

Open `index.html` using VS Code Live Server, or run:

```bash
npx --yes serve .
```

Open the local URL printed in the terminal.

### 6. Connect MetaMask

Connect MetaMask to the local Hardhat network:

- Network name: Hardhat Localhost
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency symbol: ETH

Then connect your wallet, enter a message, and submit the transaction.

**Important:** This project is intended for local development and testing. Hardhat test accounts and their private keys must never be used on a real network.

## Project Structure

- `contracts/MessageBoard.sol` — smart contract.
- `scripts/deploy.js` — deployment script.
- `test/MessageBoard.js` — automated contract tests.
- `index.html` — frontend interface.
- `hardhat.config.ts` — Hardhat configuration.

## Learning Objectives

This project demonstrates basic smart contract development, automated testing, local deployment, wallet integration, blockchain reads, and transaction writes.

## License

MIT