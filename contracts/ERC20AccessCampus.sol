// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AccessERC20 is ERC20 {
    address _owner;

    modifier isOwner() {
        address owner = _msgSender();
        require(_owner == owner, "Not owner");
        _;
    }

    constructor(uint256 _initialSupply, address _ownerFrom)
        ERC20("Access", "ACC")
    {
        _owner = _ownerFrom;
        _mint(msg.sender, _initialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function transfer(address to, uint256 amount)
        public
        override
        isOwner
        returns (bool)
    {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override isOwner returns (bool) {
        _transfer(from, to, amount);
        return true;
    }

    function burnToken(address _from, uint256 _amount)
        public
        isOwner
        returns (bool)
    {
        _burn(_from, _amount);
        return true;
    }

    function allowance(address owner, address spender)
        public
        view
        override
        isOwner
        returns (uint256)
    {}

    function approve(address spender, uint256 amount)
        public
        override
        isOwner
        returns (bool)
    {}

    function increaseAllowance(address spender, uint256 addedValue)
        public
        override
        isOwner
        returns (bool)
    {}

    function decreaseAllowance(address spender, uint256 subtractedValue)
        public
        override
        isOwner
        returns (bool)
    {}
}
