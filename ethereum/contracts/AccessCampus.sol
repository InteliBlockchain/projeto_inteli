// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;
/*
AccessCampus contract: consolidation of Person IDs checking in *OR* out in a given day
    . state variables
        - owner: EOA == Inteli mngmt
        - Access: .sol object = Person ID and moment of entry/exit
        - entries: log of check-ins in a given day
        - exits: log of check-outs in a given day
    . methods: create and retrieve events and register in state variable
*/
contract AccessCampus {
    address owner;
    struct Access {
        address userAddress;
        uint256 time;
    }

    mapping(string => Access[]) checkIns;
    mapping(string => Access[]) checkOuts;

    constructor () {
        owner = msg.sender;
    }

    function registerCheckIn(
        address _userAddress,
        uint256 _time,
        string memory _date
    ) public {
        require(msg.sender == owner);
        Access memory checkIn = Access({
            userAddress: _userAddress,
            time: _time
        });
        checkIns[_date].push(checkIn);
    }

    function registerCheckOut(
        address _userAddress,
        uint256 _time,
        string memory _date
    ) public {
        require(msg.sender == owner);
        Access memory checkOut = Access({
            userAddress: _userAddress,
            time: _time
        });
        checkOuts[_date].push(checkOut);
    }

    function getCheckIns(string memory _date)
        public
        view
        returns (Access[] memory)
    {
        require(msg.sender == owner);
        return checkIns[_date];
    }

    function getCheckOuts(string memory _date)
        public
        view
        returns (Access[] memory)
    {
        require(msg.sender == owner);
        return checkOuts[_date];
    }
}
