
import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { network } from "hardhat";

describe("AjoSavings with payment deadlines", function () {
  let ethers;
  let ajo;
  let member1, member2, member3, outsider;
  let contribution;


  const duration = 3600;

  beforeEach(async function () {
    const connection = await network.connect();
    ethers = connection.ethers;

    [, member1, member2, member3, outsider] =
      await ethers.getSigners();

    contribution = ethers.parseEther("0.01");
    const AjoSavings = await ethers.getContractFactory("AjoSavings");

    ajo = await AjoSavings.deploy(
      member1.address,
      member2.address,
      member3.address,
      contribution,
      duration
    );

    await ajo.waitForDeployment();
  });

  async function passDeadline() {
    await ethers.provider.send("evm_increaseTime", [duration + 1]);
    await ethers.provider.send("evm_mine", []);
  }

  it("starts with member 1 as recipient", async function () {
    expect(await ajo.getCurrentRecipient()).to.equal(member1.address);
    expect(await ajo.currentRound()).to.equal(1n);
  });

  it("rejects contributions from non-members", async function () {
    await expect(
      ajo.connect(outsider).contribute({
        value: ethers.parseEther("0.01")
      })
    ).to.be.revertedWith("Not an Ajo member");
  });

  it("rejects incorrect contribution amounts", async function () {
    await expect(
      ajo.connect(member1).contribute({
        value: ethers.parseEther("0.005")
      })
    ).to.be.revertedWith("Incorrect contribution amount");
  });

  it("prevents duplicate contributions in a round", async function () {
    const contribution = ethers.parseEther("0.01");

    await ajo.connect(member1).contribute({ value: contribution });

    await expect(
      ajo.connect(member1).contribute({ value: contribution })
    ).to.be.revertedWith("Already contributed this round");
  });

  it("rejects missed-payment processing before the deadline", async function () {
    await expect(
      ajo.markMissedContributions()
    ).to.be.revertedWith("Deadline has not passed");
  });

  it("doubles the next-round contribution for members who missed the deadline", async function () {
  // Member 1 pays before the deadline.
  await ajo.connect(member1).contribute({
    value: contribution
  });

  // Move blockchain time beyond the deadline.
  await ethers.provider.send("evm_increaseTime", [duration + 1]);
  await ethers.provider.send("evm_mine", []);

  // Record the missed payments for members 2 and 3.
  await ajo.markMissedContributions();

  // Penalties apply to round 2, not round 1.
  expect(await ajo.currentRound()).to.equal(1n);

  expect(
    await ajo.doubleContributionForRound(
      await member2.getAddress(),
      2n
    )
  ).to.equal(true);

  expect(
    await ajo.doubleContributionForRound(
      await member3.getAddress(),
      2n
    )
  ).to.equal(true);

  // Members can still pay the normal amount in round 1.
  await ajo.connect(member2).contribute({
    value: contribution
  });

  await ajo.connect(member3).contribute({
    value: contribution
  });

  // Completing round 1 advances the contract to round 2.
  expect(await ajo.currentRound()).to.equal(2n);

  // The missed members now owe double.
  expect(
    await ajo.getRequiredContribution(await member2.getAddress())
  ).to.equal(contribution * 2n);

  expect(
    await ajo.getRequiredContribution(await member3.getAddress())
  ).to.equal(contribution * 2n);
});

  it("allows late payment in the current round at the normal amount", async function () {
    const contribution = ethers.parseEther("0.01");

    await ajo.connect(member1).contribute({ value: contribution });
    await passDeadline();
    await ajo.markMissedContributions();

    await ajo.connect(member2).contribute({ value: contribution });

    await expect(
      ajo.connect(member3).contribute({ value: contribution })
    ).to.emit(ajo, "PayoutCompleted")
      .withArgs(member1.address, 1n, contribution * 3n);

    expect(await ajo.currentRound()).to.equal(2n);
    expect(await ajo.getRequiredContribution(member2.address))
      .to.equal(contribution * 2n);
  });

  it("completes the next round with the required doubled contributions", async function () {
    const contribution = ethers.parseEther("0.01");

    await ajo.connect(member1).contribute({ value: contribution });
    await passDeadline();
    await ajo.markMissedContributions();

    // Finish round 1: the members who missed still pay the normal
    // round-1 amount, but their penalties apply in round 2.
    await ajo.connect(member2).contribute({ value: contribution });
    await ajo.connect(member3).contribute({ value: contribution });

    // Round 2: member 1 pays normally; members 2 and 3 pay double.
    await ajo.connect(member1).contribute({ value: contribution });

    await expect(
      ajo.connect(member2).contribute({ value: contribution * 2n })
    ).to.emit(ajo, "ContributionMade")
      .withArgs(member2.address, 2n, contribution * 2n);

    await expect(
      ajo.connect(member3).contribute({ value: contribution * 2n })
    ).to.emit(ajo, "PayoutCompleted")
      .withArgs(member2.address, 2n, contribution * 5n);

    expect(await ajo.currentRound()).to.equal(3n);
    expect(await ajo.getCurrentRecipient()).to.equal(member3.address);
  });

  it("rotates the recipient after a normal round", async function () {
    const contribution = ethers.parseEther("0.01");

    await ajo.connect(member1).contribute({ value: contribution });
    await ajo.connect(member2).contribute({ value: contribution });

    await expect(
      ajo.connect(member3).contribute({ value: contribution })
    ).to.emit(ajo, "PayoutCompleted")
      .withArgs(member1.address, 1n, contribution * 3n);

    expect(await ajo.currentRound()).to.equal(2n);
    expect(await ajo.getCurrentRecipient()).to.equal(member2.address);
  });
});
