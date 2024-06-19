// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TaskOwnerReedemsContract {
    uint public deadline;
    address payable public owner;

    event Withdrawal(address payable[] _students, uint when);

    constructor(uint _deadline) payable {
        require(
            block.timestamp < _deadline,
            'Unlock time should be in the future'
        );
        require(msg.value > 0, 'Reward must be greater than zero');

        (bool success, ) = payable(address(this)).call{value: msg.value}('');
        require(success, 'Transfer failed.');
        deadline = _deadline;
        owner = payable(msg.sender);
    }

    receive() external payable {}

    function redeemRewards(
        address payable[] memory _students
    ) external payable {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);
        require(
            msg.sender == owner,
            'The owner must be the one to effect the payment'
        );

        require(address(this).balance > 0, 'No funds to withdraw');
        require(
            block.timestamp < deadline,
            'Deadline expired. No longer allowing withdraws.'
        );

        for (uint i = 0; i < _students.length; i++) {
            uint256 individualReward = (
                i < _students.length - 1
                    ? address(this).balance / 2
                    : address(this).balance
            );

            (bool success, ) = payable(_students[i]).call{
                value: individualReward
            }('');

            require(success, 'Transfer failed.');
        }

        emit Withdrawal(_students, block.timestamp);
    }

    function cancelDeal() public payable {
        require(msg.sender == owner, "You aren't the owner");
        require(address(this).balance > 0, 'No funds to withdraw');

        owner.transfer(address(this).balance);
    }
}
