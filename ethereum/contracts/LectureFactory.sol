//SPDX-License-Identifier: GPL-3.0 
pragma solidity ^0.8.0;

import "./Lecture.sol";

contract LectureFactory{
    
    address owner;
   
    struct LectureStruct{
        string name;
        address endereco;
    }

    LectureStruct[] public lectures;


    constructor () {
        owner = msg.sender;
    }

    function createLecture(string memory _lectureName,address[] memory _arrayUsers, string memory _ipfsAddress) public {
        require(msg.sender == owner);
        Lecture mintLecture = new Lecture (_arrayUsers, _ipfsAddress);

        LectureStruct memory newLecture = LectureStruct({
            name: _lectureName,
            endereco: address(mintLecture)
        });

        lectures.push(newLecture);
    }

}