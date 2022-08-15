//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Lecture.sol";

contract LectureFactory {
    address public owner;

    address[] lectures;

    modifier isOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    event NewLecture(address);

    function createLecture(
        address[] memory _arrayUsers,
        string memory _ipfsAddress
    ) public isOwner {
        Lecture mintLecture = new Lecture(_arrayUsers, _ipfsAddress, owner);

        emit NewLecture(address(mintLecture));

        lectures.push(address(mintLecture));
    }

    function viewLectures() public view isOwner returns (address[] memory) {
        return (lectures);
    }
}
