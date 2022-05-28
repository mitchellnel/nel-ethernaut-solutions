// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FakeLibrary {
    uint256 num1 = 0;
    uint256 num2 = 0;

    uint256 storedTime;

    function setTime(uint256 _time) public {
        storedTime = _time;
    }
}
