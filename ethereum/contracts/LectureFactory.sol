//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Lecture.sol";

contract LectureFactory {
    address public owner;

    struct LectureStruct {
        string name;
        address endereco;
    }

    LectureStruct[] public lectures;

    constructor() {
        owner = msg.sender;
    }

    function createLecture(
        string memory _lectureName,
        address[] memory _arrayUsers,
        string memory _ipfsAddress
    ) public returns (address) {
        require(msg.sender == owner);
        Lecture mintLecture = new Lecture(_arrayUsers, _ipfsAddress);

        LectureStruct memory newLecture = LectureStruct({
            name: _lectureName,
            endereco: address(mintLecture)
        });

        lectures.push(newLecture);

        return (address(mintLecture));
    }

    function viewLectures() public view returns (LectureStruct[] memory) {
        require(msg.sender == owner);
        return (lectures);
    }
}
