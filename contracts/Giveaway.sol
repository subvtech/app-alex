// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract GiveawayContract {
    address payable public scapegoat;
    uint public amount;

    event Withdrawal(uint _amount, uint when);

    constructor() payable {
        amount = msg.value;
        scapegoat = payable(msg.sender);
    }

    function withdraw(address payable _freelancer) public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(address(this).balance > 0, 'No funds to withdraw');

        emit Withdrawal(address(this).balance, block.timestamp);
        _freelancer.transfer(address(this).balance);
    }
}
