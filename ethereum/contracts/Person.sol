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

    struct activitiesStruct {
        string name;
        address activityAddress;
    }

    mapping(string => uint64[]) private campusCheckIn;
    mapping(string => uint64[]) private campusCheckOut;
    mapping(string => activitiesStruct[]) public activities;

    constructor(address _owner) {
        owner = _owner;
    }

    function registerCheckIn(string memory _date, uint64 _unixTime) public {
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

    function registerCheckOut(string memory _date, uint64 _unixTime) public {
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
        string memory _activityName,
        address _activityAddress
    ) public {
        require(msg.sender == owner);
        activities[_activityType].push(activitiesStruct({
            name: _activityName,
            activityAddress: _activityAddress
        }));
    }

    function getActivities(string memory _activityType)
        public
        view
        returns (activitiesStruct[] memory)
    {
        require(msg.sender == owner);
        return activities[_activityType];
    }

    function eraseMe() public {
        require(msg.sender == owner);
        selfdestruct(payable(owner));
    }
}