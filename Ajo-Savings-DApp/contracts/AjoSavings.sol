
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

contract AjoSavings {
    uint256 public immutable contributionAmount;

    address[3] public members;
    mapping(address => bool) public isMember;
    mapping(address => bool) public hasContributed;

    uint256 public currentRound = 1;
    uint256 public contributionsCount;
    uint256 public currentRecipientIndex;

    bool private payoutInProgress;

    event ContributionMade(
        address indexed member,
        uint256 indexed round,
        uint256 amount
    );

    event PayoutCompleted(
        address indexed recipient,
        uint256 indexed round,
        uint256 amount
    );

    event RoundStarted(
        uint256 indexed round,
        address indexed recipient
    );

    modifier onlyMember() {
        require(isMember[msg.sender], "Not an Ajo member");
        _;
    }

    constructor(
        address member1,
        address member2,
        address member3,
        uint256 _contributionAmount
    ) {
        require(
            member1 != address(0) &&
            member2 != address(0) &&
            member3 != address(0),
            "Member address cannot be zero"
        );

        require(
            member1 != member2 &&
            member1 != member3 &&
            member2 != member3,
            "Members must be different"
        );

        require(_contributionAmount > 0, "Amount must be greater than zero");

        members = [member1, member2, member3];

        isMember[member1] = true;
        isMember[member2] = true;
        isMember[member3] = true;

        contributionAmount = _contributionAmount;

        emit RoundStarted(1, member1);
    }

    function getCurrentRecipient() public view returns (address) {
        return members[currentRecipientIndex];
    }

    function getPotBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function contribute() external payable onlyMember {
        require(!payoutInProgress, "Payout in progress");
        require(msg.value == contributionAmount, "Incorrect contribution");
        require(
            !hasContributed[msg.sender],
            "Already contributed this round"
        );

        hasContributed[msg.sender] = true;
        contributionsCount++;

        emit ContributionMade(
            msg.sender,
            currentRound,
            msg.value
        );

        if (contributionsCount == 3) {
            _payout();
        }
    }

    function _payout() private {
        payoutInProgress = true;

        uint256 completedRound = currentRound;
        address recipient = members[currentRecipientIndex];
        uint256 payoutAmount = contributionAmount * 3;

        // Prepare the next round before making the external transfer.
        // If the transfer fails, the transaction reverts all these changes.
        for (uint256 i = 0; i < 3; i++) {
            hasContributed[members[i]] = false;
        }

        contributionsCount = 0;
        currentRound++;
        currentRecipientIndex = (currentRecipientIndex + 1) % 3;

        (bool success, ) = payable(recipient).call{value: payoutAmount}("");
        require(success, "Payout failed");

        payoutInProgress = false;

        emit PayoutCompleted(
            recipient,
            completedRound,
            payoutAmount
        );

        emit RoundStarted(
            currentRound,
            getCurrentRecipient()
        );
    }
}
