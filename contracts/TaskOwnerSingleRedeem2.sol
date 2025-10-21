// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TaskOwnerSingleRedeem2 {
    address payable public owner;
    address[] public redeemers;
    uint public redeemersCount;
    uint share;

    constructor(uint _totalNumberOfStudents) payable {
        require(msg.value > 0, 'Reward must be greater than zero');
        require(
            _totalNumberOfStudents > 0,
            'The total number of students must be greater than zero'
        );
        (bool success, ) = payable(address(this)).call{value: msg.value}('');
        require(success, 'Transfer failed.');
        share = address(this).balance / _totalNumberOfStudents;
        redeemers = new address[](_totalNumberOfStudents);
        owner = payable(msg.sender);
    }

    receive() external payable {}

    event RewardRedeemed(address indexed student, uint256 amount);
    event DealCanceled(address indexed owner, uint256 amount);

    modifier isTheOwner() {
        require(
            msg.sender == owner,
            'The owner must be the one to effect the payment'
        );
        _;
    }

    modifier mustHaveFunds() {
        require(address(this).balance > 0, 'No funds to withdraw');
        _;
    }

    modifier validAddress(address _student) {
        require(_student != address(0), "Invalid address");
        _;
    }

    function redeemSingleReward(
        address payable _student,
        uint grade
    ) external payable isTheOwner validAddress(_student){
        require(
            _student != owner,
            'The owner cannot withdraw the funds like this'
        );


        require(
            !containsAddress(_student),
            'Cannot reward the same address twice'
        );

        uint256 individualReward = ((share * grade) / 100);
        (bool success, ) = payable(_student).call{value: individualReward}('');

        require(success, 'Transfer failed.');
        redeemers[redeemersCount] = _student;
        redeemersCount += 1;
        emit RewardRedeemed(_student, individualReward);
    }

    function redeemRewards(
        address payable[] memory _students,
        uint[] memory grades,
        bool redeemAll
    ) external payable isTheOwner mustHaveFunds {
        require(
            _students.length + redeemersCount <= redeemers.length,
            'The student list cannot surpass the empty spots in the redeemed array'
        );

        require(
            _students.length == grades.length,
            'There must be one grade per address provided'
        );

        for (uint i = 0; i < _students.length; i++) {
            require(
                grades[i] >= 0 && grades[i] <= 100,
                'Grades must be in between 0-100'
            );

            if (grades[i] == 0) continue;

            if (containsAddress(_students[i])) continue;

            uint256 individualReward = ((share * grades[i]) / 100);

            (bool success, ) = payable(_students[i]).call{
                value: individualReward
            }('');

            require(success, 'Transfer failed.');
            redeemers[redeemersCount] = _students[i];
            redeemersCount += 1;
            emit RewardRedeemed(_students[i], individualReward);
        }
        if (redeemAll) owner.transfer(address(this).balance);
    }

    function cancelDeal() external payable isTheOwner mustHaveFunds {
        uint256 balance = address(this).balance;
        owner.transfer(balance);
        emit DealCanceled(owner, balance);
    }

    function containsAddress(address _student) public view validAddress(_student) returns (bool) {
        for (uint i = 0; i < redeemersCount; i++) {
            if (_student == redeemers[i]) {
                return true;
            }
        }
        return false;
    }

}
