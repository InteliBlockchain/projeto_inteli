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

// TODO: separar contratos em arquivos
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
    }
}
