import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

describe("MessageBoard", async function () {
  let messageBoard;

  beforeEach(async function () {
    const { viem } = await network.connect();

    messageBoard = await viem.deployContract("MessageBoard");
  });

  it("should return an empty string after deployment", async function () {
    const message = await messageBoard.read.getMessage();

    assert.equal(message, "");
  });

  it("should update the message", async function () {
    await messageBoard.write.setMessage(["hello world"]);

    const message = await messageBoard.read.getMessage();

    assert.equal(message, "hello world");
  });
});