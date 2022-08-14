//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Lecture.sol";

contract LectureFactory {
    address owner;

    address[] public lectures;

    constructor() {
        owner = msg.sender;
    }

    event NewLecture(address);

    function createLecture(
        address[] memory _arrayUsers,
        string memory _ipfsAddress
    ) public {
        require(msg.sender == owner);
        Lecture mintLecture = new Lecture(_arrayUsers, _ipfsAddress, owner);
        lectures.push(address(mintLecture));
        emit NewLecture(address(mintLecture));
    }

    function viewLectures() public view returns (address[] memory) {
        require(msg.sender == owner);
        return (lectures);
    }
}
