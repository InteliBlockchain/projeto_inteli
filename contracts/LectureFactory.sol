//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract LectureFactory is ERC1155 {
    address public owner;

    uint256 public idCount;

    mapping(uint256 => address[]) owners;

    modifier isOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }

    constructor(string memory _ipfsLink) ERC1155(_ipfsLink) {
        owner = msg.sender;
    }

    function createLecture(address[] memory _arrayUsers) public isOwner {
        idCount += 1;
        for (uint256 i = 0; i < _arrayUsers.length; i++) {
            _mint(_arrayUsers[i], idCount, 1, "");
            owners[idCount] = _arrayUsers;
        }
    }

    function burnNFT(address _address, uint256 _id) public isOwner {
        _burn(_address, _id, 1);
        address[] storage NFTowners = owners[_id];
        for (uint256 i = 0; i < NFTowners.length; i++) {
            if (NFTowners[i] == _address) {
                NFTowners[i] = NFTowners[NFTowners.length - 1];
                NFTowners.pop();
            }
        }
        owners[_id] = NFTowners;
    }

    function viewLectureOwners(uint256 _id)
        public
        view
        returns (address[] memory)
    {
        return (owners[_id]);
    }
}
