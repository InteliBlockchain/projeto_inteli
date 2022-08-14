// SPDX-License-Identifier: MIT

//TODO: openzeppelin ERC1155 & Ownable - npm install? qual versao? outro jeito?
//TODO: ajuste onlyOwner
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Lecture is ERC1155 {
    address owner;
    address[] public people;

    constructor(address[] memory _arrayUsers, string memory _ipfsLink, address _owner)
        ERC1155(_ipfsLink)
    {
        owner = _owner;
        people = _arrayUsers;
        for (uint256 i = 0; i < _arrayUsers.length; i++) {
            _mint(_arrayUsers[i], 1, 1, "");
        }
    }

    function burnNFT(address _address) public {
        require(msg.sender == owner, "not owner");
        _burn(_address, 1, 1);
    }
}
