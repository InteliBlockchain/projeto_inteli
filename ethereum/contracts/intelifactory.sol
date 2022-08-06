// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract InteliFactory {
    address owner;
    mapping(string => address) students;

    constructor() {
        owner = msg.sender;
    }

    function CreateStudent(string memory _ra) public {
        require(owner == msg.sender);
        Person person = new Person();
        students[_ra] = address(person);
    }

    function GetStudent(string memory _ra) public view returns (address) {
        require(owner == msg.sender);
        return students[_ra];
    }

    function RemoveStudent(string memory _ra) public {
        require(owner == msg.sender);
        delete students[_ra];

        //Chamar burn do Person - Contrato do Paulo
    }
}

contract Person {
    address public owner;
    mapping(string => uint64[]) private checkIn;
    mapping(string => uint64[]) private checkOut;
    mapping(string => mapping(string => address[])) public activities;

    constructor() {
        owner = msg.sender;
    }

    //Função que registra entrada(dia e tempo) e joga pra variável
    function newCheckIn(string memory date, uint64 unixTime) public {
        require(msg.sender == owner);
        checkIn[date].push(unixTime);
    }

    function getCheckIn(string memory key)
        public
        view
        returns (uint64[] memory)
    {
        return checkIn[key];
    }

    //Função que registra saida(dia e tempo) e joga pra variável
    function newCheckOut(string memory date, uint64 unixTime) public {
        require(msg.sender == owner);
        checkOut[date].push(unixTime);
    }

    function getCheckOut(string memory key)
        public
        view
        returns (uint64[] memory)
    {
        return checkOut[key];
    }

    function newActivity(
        string memory activityType,
        string memory date,
        address activityAdress
    ) public {
        activities[activityType][date].push(activityAdress);
    }

    function viewActivity(string memory activityType, string memory date)
        public
        view
        returns (address[] memory)
    {
        return activities[activityType][date];
    }
}
