
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

contract AjoSavings {
    uint256 public immutable contributionAmount;
    uint256 public immutable roundDuration;

    address[3] public members;
    mapping(address => bool) public isMember;
    mapping(address => bool) public hasContributed;

    // Whether a member must contribute double in a specific round.
    mapping(address => mapping(uint256 => bool))
        public doubleContributionForRound;

    // The last round in which a member was marked as missing payment.
    mapping(address => uint256) public lastMissedRound;

    // Tracks whether a member has already been processed for a missed round.
    mapping(address => mapping(uint256 => bool))
        public missedRoundProcessed;

    uint256 public currentRound = 1;
    uint256 public contributionsCount;
    uint256 public currentRecipientIndex;
    uint256 public roundDeadline;

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
        address indexed recipient,
        uint256 deadline
    );

    event MemberMissedDeadline(
        address indexed member,
        uint256 indexed missedRound,
        uint256 indexed penaltyRound
    );

    modifier onlyMember() {
        require(isMember[msg.sender], "Not an Ajo member");
        _;
    }

    constructor(
        address member1,
        address member2,
        address member3,
        uint256 _contributionAmount,
        uint256 _roundDuration
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

        require(
            _contributionAmount > 0,
            "Amount must be greater than zero"
        );

        require(
            _roundDuration > 0,
            "Duration must be greater than zero"
        );

        members = [member1, member2, member3];

        isMember[member1] = true;
        isMember[member2] = true;
        isMember[member3] = true;

        contributionAmount = _contributionAmount;
        roundDuration = _roundDuration;
        roundDeadline = block.timestamp + _roundDuration;

        emit RoundStarted(1, member1, roundDeadline);
    }

    function getCurrentRecipient() public view returns (address) {
        return members[currentRecipientIndex];
    }

    function getPotBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getRequiredContribution(
        address member
    ) public view returns (uint256) {
        if (doubleContributionForRound[member][currentRound]) {
            return contributionAmount * 2;
        }

        return contributionAmount;
    }

    // Anyone can record missed payments after the deadline.
    // Members may still pay the current round afterwards.
    function markMissedContributions() external {
        require(
            block.timestamp > roundDeadline,
            "Deadline has not passed"
        );

        _markMissedMembers();
    }

    function _markMissedMembers() internal {
        uint256 missedRound = currentRound;
        uint256 penaltyRound = currentRound + 1;

        for (uint256 i = 0; i < members.length; i++) {
            address member = members[i];

            if (
                !hasContributed[member] &&
                !missedRoundProcessed[member][missedRound]
            ) {
                missedRoundProcessed[member][missedRound] = true;

                doubleContributionForRound[member][penaltyRound] = true;
                lastMissedRound[member] = missedRound;

                emit MemberMissedDeadline(
                    member,
                    missedRound,
                    penaltyRound
                );
            }
        }
    }

    function contribute() external payable onlyMember {
        // If the deadline has passed, record missed members first.
        if (block.timestamp > roundDeadline) {
            _markMissedMembers();
        }

        require(
            !hasContributed[msg.sender],
            "Already contributed this round"
        );

        uint256 requiredAmount = getRequiredContribution(msg.sender);

        require(
            msg.value == requiredAmount,
            "Incorrect contribution amount"
        );

        hasContributed[msg.sender] = true;
        contributionsCount++;

        emit ContributionMade(
            msg.sender,
            currentRound,
            msg.value
        );

        if (contributionsCount == 3) {
            _completeRound();
        }
    }

    function _completeRound() internal {
        uint256 completedRound = currentRound;
        address recipient = getCurrentRecipient();
        uint256 payoutAmount = address(this).balance;

        // Reset contribution tracking before the external transfer.
        for (uint256 i = 0; i < members.length; i++) {
            hasContributed[members[i]] = false;
        }

        contributionsCount = 0;
        currentRound++;
        currentRecipientIndex = (currentRecipientIndex + 1) % 3;
        roundDeadline = block.timestamp + roundDuration;

        emit PayoutCompleted(
            recipient,
            completedRound,
            payoutAmount
        );

        emit RoundStarted(
            currentRound,
            getCurrentRecipient(),
            roundDeadline
        );

        // Transfer the round's pot to its recipient.
        (bool success, ) = payable(recipient).call{
            value: payoutAmount
        }("");

        require(success, "Payout transfer failed");
    }
}
