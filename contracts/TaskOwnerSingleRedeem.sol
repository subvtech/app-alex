// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TaskOwnerSingleRedeem {
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

    function redeemSingleReward(
        address payable _student,
        uint grade
    ) external payable {
        require(
            msg.sender == owner,
            'The owner must be the one to effect the payment'
        );

        require(
            _student != owner,
            'The owner cannot withdraw the funds like this'
        );
        require(address(this).balance > 0, 'No funds to withdraw');

        require(
            !containsAddress(_student),
            'Cannot reward the same address twice'
        );

        uint256 individualReward = ((share * grade) / 100);
        (bool success, ) = payable(_student).call{value: individualReward}('');

        require(success, 'Transfer failed.');
        redeemers[redeemersCount] = _student;
        redeemersCount += 1;
    }

    function redeemRewards(
        address payable[] memory _students,
        uint[] memory grades
    ) external payable {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        require(
            msg.sender == owner,
            'The owner must be the one to effect the payment'
        );

        require(
            _students.length + redeemersCount <= redeemers.length,
            'The student list cannot surpass the empty spots in the redeemed array'
        );

        require(
            _students.length == grades.length,
            'There must be one grade per address provided'
        );

        require(address(this).balance > 0, 'No funds to withdraw');

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
        }
        owner.transfer(address(this).balance);
    }

    function cancelDeal() public payable {
        require(msg.sender == owner, "You aren't the owner");
        require(address(this).balance > 0, 'No funds to withdraw');

        owner.transfer(address(this).balance);
    }

    function containsAddress(address student) public view returns (bool) {
        for (uint i = 0; i < redeemersCount; i++) {
            if (student == redeemers[i]) {
                return true;
            }
        }
        return false;
    }

    function insertAddress(address payable student) private returns (bool) {
        if (redeemersCount == redeemers.length) {
            return false;
        }

        for (uint i = 0; i < redeemersCount; i++) {
            if (msg.sender == redeemers[i]) {
                return false;
            }
        }

        redeemers[redeemersCount] = student;
        redeemersCount += 1;
        return true;
    }
}
