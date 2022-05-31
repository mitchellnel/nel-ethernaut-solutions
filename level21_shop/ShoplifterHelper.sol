// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ShoplifterHelper {
    address shoplifterToHelp;
    bool public usedOnce = false;

    constructor(address _shoplifterToHelp) {
        shoplifterToHelp = _shoplifterToHelp;
    }

    function helpMe() public returns (bool) {
        usedOnce = !usedOnce;

        return !usedOnce;
    }
}
