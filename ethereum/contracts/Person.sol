// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

/*
Person contract: manage person profile and track activities
    . state variables
        - owner: EOA == Inteli mngmt
        - checkIn: log check-ins in a given day
        - checkOut: log check-outs in a given day
        - activities: log activities done by person
    . methods: create and retrieve events and register in state variable
*/
contract Person is ERC1155Holder {
    address owner;

    mapping(string => string[]) private campusCheckIn;
    mapping(string => string[]) private campusCheckOut;
    mapping(string => address[]) public activities;

    constructor(address _owner) {
        owner = _owner;
    }

    function getBalance(
	) public view returns(uint256){
		return address(this).balance;
	}
    
    function transferMoney(address payable _to, uint _value) external payable{
       _to.transfer(_value);
    }

    function registerCheckIn(string memory _date, string memory _time) public {
        require(msg.sender == owner);
        campusCheckIn[_date].push(_time);
    }

    function getCheckIn(string memory _id)
        public
        view
        returns (string[] memory)
    {
        require(msg.sender == owner);
        return campusCheckIn[_id];
    }

    function registerCheckOut(string memory _date, string memory _time) public {
        require(msg.sender == owner);
        campusCheckOut[_date].push(_time);
    }

    function getCheckOut(string memory _id)
        public
        view
        returns (string[] memory)
    {
        require(msg.sender == owner);
        return campusCheckOut[_id];
    }

    function newActivity(string memory _activityType, address _activityAddress)
        public
    {
        require(msg.sender == owner);
        activities[_activityType].push(_activityAddress);
    }

    function getActivities(string memory _activityType)
        public
        view
        returns (address[] memory)
    {
        require(msg.sender == owner);
        return activities[_activityType];
    }

    function eraseMe() public {
        require(msg.sender == owner);
        selfdestruct(payable(owner));
    }
}
