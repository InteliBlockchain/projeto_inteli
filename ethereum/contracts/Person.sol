// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;
/*
Person contract: manage person profile and track activities
    . state variables
        - owner: EOA == Inteli mngmt
        - checkIn: log check-ins in a given day
        - checkOut: log check-outs in a given day
        - activities: log activities done by person
    . methods: create and retrieve events and register in state variable
*/
contract Person {
    address owner;
    mapping(string => uint64[]) private campusCheckIn;
    mapping(string => uint64[]) private campusCheckOut;
    mapping(string => mapping(string => address[])) public activities;

    constructor(address _owner) {
        owner = _owner;
    }

    function newCheckIn(string memory _date, uint64 _unixTime) public {
        require(msg.sender == owner);
        campusCheckIn[_date].push(_unixTime);
    }

    function getCheckIn(string memory _id)
        public
        view
        returns (uint64[] memory)
    {
        require(msg.sender == owner);
        return campusCheckIn[_id];
    }

    function newCheckOut(string memory _date, uint64 _unixTime) public {
        require(msg.sender == owner);
        campusCheckOut[_date].push(_unixTime);
    }

    function getCheckOut(string memory _id)
        public
        view
        returns (uint64[] memory)
    {
        require(msg.sender == owner);
        return campusCheckOut[_id];
    }

    function newActivity(
        string memory _activityType,
        string memory _date,
        address _activityAdress
    ) public {
        require(msg.sender == owner);
        activities[_activityType][_date].push(_activityAdress);
    }

    function getActivity(string memory _activityType, string memory _date)
        public
        view
        returns (address[] memory)
    {
        require(msg.sender == owner);
        return activities[_activityType][_date];
    }

    function killMe() public {
        require(msg.sender == owner);
        selfdestruct(payable(owner));
    }
}