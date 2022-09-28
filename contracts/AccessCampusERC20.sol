// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./ERC20AccessCampus.sol";

contract AccessCampus {
    AccessERC20 public token;

    address owner;

    modifier isOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(uint256 _tokenAmount) {
        owner = msg.sender;
        token = new AccessERC20(_tokenAmount, address(this));
    }

    function givePresence(address _to) public isOwner returns (bool) {
        token.transferFrom(address(this), _to, 1);
        return true;
    }

    function removePresence(address _student, uint256 _times)
        public
        isOwner
        returns (bool)
    {
        token.burnToken(_student, _times);
        return true;
    }

    function seePresences(address _student) public view returns (uint256) {
        uint256 presences = token.balanceOf(_student);
        return presences;
    }
}
