//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Lecture.sol";

contract LectureFactory {
    address public owner;

    event NewLecture(address);

    address[] lectures;

    constructor() {
        owner = msg.sender;
    }

    function createLecture(
        address[] memory _arrayUsers,
        string memory _ipfsAddress
    ) public {
        require(msg.sender == owner);
        Lecture mintLecture = new Lecture(_arrayUsers, _ipfsAddress, owner);

        emit NewLecture(address(mintLecture));

        lectures.push(address(mintLecture));
    }

    function viewLectures() public view returns (address[] memory) {
        require(msg.sender == owner, "not the owner");
        return (lectures);
    }
}
