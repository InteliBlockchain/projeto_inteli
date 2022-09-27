//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract LectureFactory is ERC1155 {
    address public owner;
    address[] arrayUsers;

    address[] lectures;
    int256 idCount;
    // mapping(idCount => arrayUsers) public lectureOwners;

    modifier isOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }

    constructor(string memory _ipfsLink) ERC1155(_ipfsLink) {
        owner = msg.sender;
    }

    function createLecture(
        address[] memory _arrayUsers,
        string memory _ipfsAddress
    ) public isOwner {
        idCount += 1;
        for (uint256 i = 0; i < _arrayUsers.length; i++) {
            _mint(_arrayUsers[i], idCount, 1, "");
            lectureOwners;
        }
    }

    function burnNFT(address _address, uint256 _id) public isOwner {
        _burn(_address, _id, 1);
    }

    function viewLectures() public view isOwner returns (address[] memory) {
        return (lectures);
    }

    function viewBalance(adress[] memory _arrayUsers, uint256[] _id)
        public
        isOwner
    {
        balanceOfBatch(_arrayUsers, _id);
    }

    // function viewLectureOwners()
    //     public
    //     view
    //     idCount
    //     returns (address[] memory)
    // {
    //     return (lectureOwners.arrayUsers);
    // }
}
