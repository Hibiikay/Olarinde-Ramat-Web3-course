
import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("AjoSavings", function () {
  let ajo;
  let member1, member2, member3, outsider;

  const amount = ethers.parseEther("0.01");

  beforeEach(async function () {
    [, member1, member2, member3, outsider] =
      await ethers.getSigners();

    const AjoSavings = await ethers.getContractFactory("AjoSavings");

    ajo = await AjoSavings.deploy(
      member1.address,
      member2.address,
      member3.address,
      amount
    );

    await ajo.waitForDeployment();
  });

  it("sets the first member as the first recipient", async function () {
    expect(await ajo.getCurrentRecipient()).to.equal(member1.address);
    expect(await ajo.currentRound()).to.equal(1n);
  });

  it("rejects contributions from non-members", async function () {
    await expect(
      ajo.connect(outsider).contribute({ value: amount })
    ).to.be.revertedWith("Not an Ajo member");
  });

  it("rejects an incorrect contribution amount", async function () {
    await expect(
      ajo.connect(member1).contribute({
        value: ethers.parseEther("0.005")
      })
    ).to.be.revertedWith("Incorrect contribution");
  });

  it("prevents a member contributing twice in one round", async function () {
    await ajo.connect(member1).contribute({ value: amount });

    await expect(
      ajo.connect(member1).contribute({ value: amount })
    ).to.be.revertedWith("Already contributed this round");
  });

  it("pays the first member and advances to the second", async function () {
    await ajo.connect(member1).contribute({ value: amount });
    await ajo.connect(member2).contribute({ value: amount });

    expect(await ajo.contributionsCount()).to.equal(2n);

    await expect(
      ajo.connect(member3).contribute({ value: amount })
    )
      .to.emit(ajo, "PayoutCompleted")
      .withArgs(member1.address, 1n, amount * 3n);

    expect(await ajo.currentRound()).to.equal(2n);
    expect(await ajo.getCurrentRecipient()).to.equal(member2.address);
    expect(await ajo.contributionsCount()).to.equal(0n);
    expect(await ajo.getPotBalance()).to.equal(0n);
  });

  it("allows the next round to pay the second member", async function () {
    // Round 1: first member receives the pot.
    await ajo.connect(member1).contribute({ value: amount });
    await ajo.connect(member2).contribute({ value: amount });
    await ajo.connect(member3).contribute({ value: amount });

    // Round 2: second member receives the pot.
    await ajo.connect(member1).contribute({ value: amount });
    await ajo.connect(member2).contribute({ value: amount });

    await expect(
      ajo.connect(member3).contribute({ value: amount })
    )
      .to.emit(ajo, "PayoutCompleted")
      .withArgs(member2.address, 2n, amount * 3n);

    expect(await ajo.currentRound()).to.equal(3n);
    expect(await ajo.getCurrentRecipient()).to.equal(member3.address);
  });
});
