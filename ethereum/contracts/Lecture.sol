// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lecture is ERC1155, Ownable {

    address[] public people;

    constructor(address[] memory _arrayUsers, string memory _ipfsLink) ERC1155(_ipfsLink) {
        people = _arrayUsers;
        for (uint i = 0; i >= _arrayUsers.length; i ++){
            _mint(_arrayUsers[i], 1, _arrayUsers.length, "");
        }       
    }

    function burnNFT(address _address) public onlyOwner {
        _burn(_address, 1, 1);
    }
   
}