//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol"; 

contract LectureFactory is ERC1155 {
    address public owner;

    mapping (uint256 => string) private _tokenURIs;
    using Counters for Counters.Counter; 
    Counters.Counter public _tokenIds; 

    mapping(uint256 => address[]) public owners;

    modifier isOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }

    constructor() ERC1155("") {
        owner = msg.sender;
    }

    function createLecture(address[] memory _arrayUsers, string memory tokenURI) public isOwner {
        uint256 newItemId = _tokenIds.current(); 
        for (uint256 i = 0; i < _arrayUsers.length; i++) {
            _mint(_arrayUsers[i], newItemId, 1, "");
            owners[newItemId] = _arrayUsers;
        }
        _setTokenUri(newItemId, tokenURI); 
        _tokenIds.increment();
    }

    function uri(uint256 tokenId) override public view returns (string memory) { 
        return(_tokenURIs[tokenId]); 
    } 

    function _setTokenUri(uint256 tokenId, string memory tokenURI) private {
         _tokenURIs[tokenId] = tokenURI; 
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
}
