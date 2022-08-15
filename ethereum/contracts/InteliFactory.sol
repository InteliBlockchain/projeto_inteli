// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

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
    address public owner;
    mapping(string => address) students;
    mapping(address => string) wallets;
    address[] arrStudents;

    constructor() {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }

    function createStudent(string memory _id) public isOwner {
        require(students[_id] == address(0), "Student already exists");
        Person person = new Person(owner);
        students[_id] = address(person);
        wallets[address(person)] = _id;
        arrStudents.push(address(person));
    }

    function getWallet(string memory _ra)
        public
        view
        isOwner
        returns (address)
    {
        return students[_ra];
    }

    function getStudent(address _id)
        public
        view
        isOwner
        returns (string memory)
    {
        return wallets[_id];
    }

    function getArrStudent() public view isOwner returns (address[] memory) {
        return arrStudents;
    }

    function removeStudent(string memory _ra) public isOwner {
        require(students[_ra] != address(0), "Student does not exist");
        for (uint256 i = 0; i >= arrStudents.length; i++) {
            if (arrStudents[i] == students[_ra]) {
                delete arrStudents[i];
            }
        }
        delete wallets[students[_ra]];
        delete students[_ra];
    }

    function transferMoney(address payable _id, uint _amount) external isOwner payable {
        _id.transfer(_amount);
    }
    
    function getBalance() public isOwner view returns (uint) {
        return address(this).balance;
    }
}
