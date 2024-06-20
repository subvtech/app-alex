// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TaskStudentReedemsContract {
    uint public deadline;
    address payable public owner;
    address payable[] public students;
    address payable[] public paidStudents;

    event Withdrawal(uint _amount, uint when);

    constructor(uint _deadline, address payable[] memory _students) payable {
        require(
            block.timestamp < _deadline,
            'Unlock time should be in the future'
        );
        require(msg.value > 0, 'Reward must be greater than zero');
        require(_students.length > 0, 'Student list cannot be empty');
        (bool success, ) = payable(address(this)).call{value: msg.value}('');
        require(success, 'Transfer failed.');
        students = _students;
        deadline = _deadline;
        owner = payable(msg.sender);
    }

    receive() external payable {}

    function withdraw() public payable {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(address(this).balance > 0, 'No funds to withdraw');
        require(
            block.timestamp < deadline,
            'Deadline expired. No longer allowing withdraws.'
        );
        require(
            msg.sender != owner,
            "The owner can't withdraw the reward this way"
        );
        require(
            containsAddress(msg.sender, students),
            'This address cannot claim any reward'
        );
        require(
            !containsAddress(msg.sender, paidStudents),
            'This address already claimed their reward'
        );

        uint256 individualReward = (
            paidStudents.length < students.length - 1
                ? address(this).balance / 2
                : address(this).balance
        );
        (bool success, ) = payable(msg.sender).call{value: individualReward}(
            ''
        );
        require(success, 'Transfer failed.');
        paidStudents.push(payable(msg.sender));
        emit Withdrawal(individualReward, block.timestamp);
    }

    function cancelDeal() public payable {
        require(msg.sender == owner, "You aren't the owner");
        require(address(this).balance > 0, 'No funds to withdraw');

        emit Withdrawal(address(this).balance, block.timestamp);
        owner.transfer(address(this).balance);
    }

    function containsAddress(
        address maybeStudent,
        address payable[] memory studentList
    ) public pure returns (bool) {
        for (uint i = 0; i < studentList.length; i++) {
            if (maybeStudent == studentList[i]) {
                return true;
            }
        }
        return false;
    }
}
