// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TaskOwnerReedemsContract2 {
    address payable public owner;

    event Withdrawal(address payable[] _students, uint when);

    constructor() payable {
      
        require(msg.value > 0, 'Reward must be greater than zero'); 
      
        (bool success, ) = payable(address(this)).call{value: msg.value}(
            ""
        );   
        require(success, 'Transfer failed.');       
       
        owner = payable(msg.sender);
    }

    receive() external payable {}

    function redeemRewards(address payable[] memory _students, uint[] memory grades) external payable {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);
        require(
            msg.sender == owner,
            'The owner must be the one to effect the payment'
        );
        require(_students.length == grades.length, "There must be one grade per address provided");
        require(address(this).balance > 0, "No funds to withdraw");
       
        uint zerosCounter = 0;
        for (uint i = 0; i < grades.length; i++) {
            require(grades[i] >= 0 && grades[i] <= 100 , "Grades must be in between 0-100");

            if (0 == grades[i]) {
                zerosCounter++;
            }
        }
        require(_students.length != zerosCounter, "There must be at least one grade above zero");
        
        uint share = address(this).balance / _students.length - zerosCounter;
    
        for (uint i = 0; i < _students.length; i++) {          
           
            if(grades[i] == 0) continue;

            uint256 individualReward = (
               share * grades[i] / 100
            );
            
            (bool success, ) = payable(_students[i]).call{value: individualReward}(
                ""
            );
            
            require(success, 'Transfer failed.');
          
        }    
        owner.transfer(address(this).balance);
        emit Withdrawal(_students, block.timestamp);
        
        
    }

    function cancelDeal() public payable {
        require(msg.sender == owner, "You aren't the owner");
        require(address(this).balance > 0, "No funds to withdraw");
       
      
        owner.transfer(address(this).balance);
    }


}