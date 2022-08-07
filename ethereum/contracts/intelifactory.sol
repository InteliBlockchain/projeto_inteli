// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./Person.sol";
/*
InteliFactory contract: master contract of the project. handle deployment of other
contracts and consolidate data
    . state variables
        - owner: EOA, represents Inteli mngmt
        - students: maps students ID to their hashed ID on the blockchain
    . methods: create, retrieve and remove Persons
*/

contract InteliFactory {
    address owner;
    mapping(string => address) students;
    mapping(address => string) wallets;

    constructor() {
        owner = msg.sender;
    }

    function createStudent(string memory _id) public {
        require(owner == msg.sender);
        Person person = new Person(owner);
        students[_id] = address(person);
        wallets[address(person)] = _id;
    }

    function getWallet(string memory _id) public view returns (address) {
        require(owner == msg.sender);
        return students[_id];
    }

    function getStudent(address _id) public view returns (string memory) {
        require(owner == msg.sender);
        return wallets[_id];
    }

    function removeStudent(string memory _id) public {
        require(owner == msg.sender);
        delete wallets[students[_id]];
        delete students[_id];

        //TODO: self-destruct de PERSON
    }
}
/*
AccessCampus contract: consolidation of Person IDs checking in *OR* out in a given day
    . state variables
        - owner: EOA == Inteli mngmt
        - Access: .sol object = Person ID and moment of entry/exit
        - entries: log of check-ins in a given day
        - exits: log of check-outs in a given day
    . methods: create and retrieve events and register in state variable
*/
contract AccessCampus is InteliFactory{
    struct Access {
        address userAddress;
        uint256 time;
    }

    mapping(string => Access[]) checkIns;
    mapping(string => Access[]) checkOuts;

    function createCheckIn(
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

    function createCheckOut(
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
