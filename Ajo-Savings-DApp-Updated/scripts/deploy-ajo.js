
const { network } = await import("hardhat");

async function main() {
  const { ethers } = await network.connect();

  const member1 = "0xB0f326bB3602b0A342cfd148B4e72cB524802028";
  const member2 = "0x5b3fE5BfD73E0c91848d3E3798dFeFeDE8d7A838";
  const member3 = "0x13419B3324a36B2E0E51D29Af0D07cF1D24EBd65";

  const contributionAmount = ethers.parseEther("0.001");
  const roundDuration = 24 * 60 * 60; // 24 hours

  const AjoSavings = await ethers.getContractFactory("AjoSavings");

  const ajo = await AjoSavings.deploy(
    member1,
    member2,
    member3,
    contributionAmount,
    roundDuration
  );

  await ajo.waitForDeployment();

  const address = await ajo.getAddress();

  console.log("AjoSavings deployed to:", address);
  console.log("Round duration:", roundDuration, "seconds");
  console.log("Contribution per member:", ethers.formatEther(contributionAmount), "ETH");
  console.log("First recipient:", await ajo.getCurrentRecipient());
  console.log("First round deadline:", (await ajo.roundDeadline()).toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
