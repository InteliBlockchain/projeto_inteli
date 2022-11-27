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
    address public owner;

    event Received(address, uint256);

    modifier isOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }

    mapping(string => uint64[]) private campusCheckIn;
    mapping(string => uint64[]) private campusCheckOut;
    mapping(string => address[]) public activities;

    constructor(address _owner) {
        owner = _owner;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function transferMoney(address payable _to)
        external
        isOwner
        payable
    {
        _to.transfer(msg.value);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function registerCheckIn(string memory _date, uint64 _time) public isOwner {
        campusCheckIn[_date].push(_time);
    }

    function getCheckIn(string memory _date)
        public
        view
        isOwner
        returns (uint64[] memory)
    {
        return campusCheckIn[_date];
    }

    function registerCheckOut(string memory _date, uint64 _unixTime)
        public
        isOwner
    {
        campusCheckOut[_date].push(_unixTime);
    }

    function getCheckOut(string memory _date)
        public
        view
        isOwner
        returns (uint64[] memory)
    {
        return campusCheckOut[_date];
    }

    function newActivity(string memory _activityType, address _activityAddress)
        public
        isOwner
    {
        activities[_activityType].push(_activityAddress);
    }

    function getActivities(string memory _activityType)
        public
        view
        isOwner
        returns (address[] memory)
    {
        return activities[_activityType];
    }

    function eraseMe() public isOwner {
        selfdestruct(payable(owner));
    }
}
