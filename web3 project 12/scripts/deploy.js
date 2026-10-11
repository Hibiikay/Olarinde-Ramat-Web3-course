const { network } = await import("hardhat");

async function main() {
  const { ethers } = await network.connect();

  const MessageBoard = await ethers.getContractFactory("MessageBoard");

  const messageBoard = await MessageBoard.deploy();

  await messageBoard.waitForDeployment();

  console.log(
    "MessageBoard deployed to:",
    await messageBoard.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});